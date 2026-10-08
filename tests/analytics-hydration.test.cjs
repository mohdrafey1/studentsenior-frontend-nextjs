const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const { JSDOM } = require('jsdom');

for (const extension of ['.ts', '.tsx'])
    require.extensions[extension] = (module, filename) =>
        module._compile(
            ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
                compilerOptions: {
                    module: ts.ModuleKind.CommonJS,
                    target: ts.ScriptTarget.ES2020,
                    jsx: ts.JsxEmit.ReactJSX,
                    esModuleInterop: true,
                },
            }).outputText,
            filename,
        );

test('real Providers hydration waits for PersistGate and the first screen has the resolved college', async () => {
    const dom = new JSDOM(
        '<!doctype html><html><body><div id="root"></div></body></html>',
        { url: 'https://web.example.test/local-college/notes' },
    );
    const replacements = {
        window: dom.window,
        document: dom.window.document,
        navigator: dom.window.navigator,
        location: dom.window.location,
        localStorage: dom.window.localStorage,
        HTMLElement: dom.window.HTMLElement,
        HTMLIFrameElement: dom.window.HTMLIFrameElement,
        IS_REACT_ACT_ENVIRONMENT: true,
    };
    const batches = [],
        requests = [];
    replacements.fetch = async (url, options = {}) => {
        requests.push(url);
        if (String(url).endsWith('/auth/user'))
            return { status: 401, ok: false };
        assert.ok(String(url).endsWith('/events'));
        batches.push(JSON.parse(options.body));
        return { status: 204, headers: new Headers() };
    };
    const descriptors = Object.fromEntries(
        Object.keys(replacements).map((key) => [
            key,
            Object.getOwnPropertyDescriptor(globalThis, key),
        ]),
    );
    for (const [key, value] of Object.entries(replacements))
        Object.defineProperty(globalThis, key, {
            configurable: true,
            writable: true,
            value,
        });
    const React = require('react');
    const { createRoot } = require('react-dom/client');
    const { configureStore, combineReducers } = require('@reduxjs/toolkit');
    const { persistReducer, persistStore } = require('redux-persist');
    const user = require('../src/redux/slices/userSlice.ts').default;
    let releaseStorage;
    const storage = {
        getItem: () =>
            new Promise((resolve) => {
                releaseStorage = resolve;
            }),
        setItem: async () => {},
        removeItem: async () => {},
    };
    const store = configureStore({
        reducer: persistReducer(
            { key: 'root', storage },
            combineReducers({ user }),
        ),
        middleware: (getDefault) => getDefault({ serializableCheck: false }),
    });
    const persistor = persistStore(store);
    const originalLoad = Module._load;
    Module._load = function (request, parent, isMain) {
        if (request === '@/redux/store') return { store, persistor };
        if (request === 'next/navigation')
            return {
                usePathname: () => '/local-college/notes',
                useParams: () => ({ slug: 'local-college' }),
            };
        if (request === '@/config/apiUrls')
            return {
                api: {
                    auth: { userDetail: 'https://api.example.test/auth/user' },
                },
            };
        if (request.startsWith('@/'))
            request = path.join(__dirname, '../src', request.slice(2));
        return originalLoad.call(this, request, parent, isMain);
    };
    let root;
    try {
        const Providers = require('../src/components/Providers.tsx').default;
        const CollegeLayoutClient =
            require('../src/app/[slug]/CollegeLayoutClient.tsx').default;
        const { analytics } = require('../src/analytics/index.ts');
        root = createRoot(document.getElementById('root'));
        await React.act(async () => {
            root.render(
                React.createElement(
                    Providers,
                    null,
                    React.createElement(
                        CollegeLayoutClient,
                        {
                            slug: 'local-college',
                            sections: { notes: true },
                            collegeLinksComponent: null,
                            collegeLink2Component: null,
                        },
                        React.createElement(
                            'p',
                            { id: 'college-content' },
                            'Notes',
                        ),
                    ),
                ),
            );
        });
        assert.equal(document.querySelector('#college-content'), null);
        assert.equal(requests.length, 0);
        assert.equal(window.localStorage.getItem('ss_analytics_anon'), null);
        assert.equal(persistor.getState().bootstrapped, false);
        // Release the genuinely pending storage read. This renders the real gate,
        // layout effect and analytics passive effects through React DOM.
        await React.act(async () => {
            releaseStorage(null);
        });
        assert.equal(persistor.getState().bootstrapped, true);
        assert.ok(document.querySelector('#college-content'));
        await analytics.flush();
        const events = batches.flatMap((batch) => batch.events);
        const firstView = events.find((event) => event.name === 'screen_view');
        assert.ok(firstView);
        assert.equal(firstView.screen, '/[slug]/notes');
        assert.equal(firstView.college, 'local-college');
        assert.equal(
            events.filter((event) => event.name === 'screen_view').length,
            1,
        );
    } finally {
        if (root) await React.act(async () => root.unmount());
        persistor.pause();
        Module._load = originalLoad;
        dom.window.close();
        for (const [key, descriptor] of Object.entries(descriptors)) {
            if (descriptor) Object.defineProperty(globalThis, key, descriptor);
            else delete globalThis[key];
        }
    }
});
