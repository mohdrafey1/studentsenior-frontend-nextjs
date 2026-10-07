const ts = require('typescript');
require.extensions['.ts'] = (module, filename) =>
    module._compile(
        ts.transpileModule(require('node:fs').readFileSync(filename, 'utf8'), {
            compilerOptions: {
                module: ts.ModuleKind.CommonJS,
                target: ts.ScriptTarget.ES2020,
            },
        }).outputText,
        filename,
    );
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { startAuthCheck } = require('../src/analytics/authCheck.ts');
const {
    registerCollege,
    collegeForPath,
} = require('../src/analytics/college.ts');
const tick = () => new Promise((resolve) => setImmediate(resolve));

test('404 resolves auth as signed out and network/server failures always resolve readiness', async () => {
    for (const status of [404, 503, 'network']) {
        let ready = 0,
            signedOut = 0;
        const check = startAuthCheck({
            url: '/auth/user',
            ready: () => ready++,
            signedOut: () => signedOut++,
            signedIn: () => assert.fail('unexpected account'),
            fetcher: async () => {
                if (status === 'network') throw new Error('offline');
                return { status, ok: false };
            },
        });
        await tick();
        assert.equal(ready, 1);
        assert.equal(signedOut, status === 404 ? 1 : 0);
        check.dispose();
    }
});
test('a stalled auth check resolves readiness at five seconds', async (t) => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    let signal,
        ready = 0;
    const check = startAuthCheck({
        url: '/auth/user',
        ready: () => ready++,
        signedOut() {},
        signedIn() {},
        fetcher: async (_url, options) => {
            signal = options.signal;
            return new Promise(() => {});
        },
    });
    t.mock.timers.tick(5000);
    assert.equal(signal, undefined);
    assert.equal(ready, 1);
    check.dispose();
});
test('an online retry replaces an existing retry timer instead of multiplying calls', async (t) => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    let calls = 0;
    const check = startAuthCheck({
        url: '/auth/user',
        ready() {},
        signedOut() {},
        signedIn() {},
        fetcher: async () => {
            calls++;
            throw new Error('offline');
        },
    });
    await tick();
    t.mock.timers.tick(10000);
    check.resume();
    await tick();
    assert.equal(calls, 2);
    t.mock.timers.tick(20000);
    await tick();
    assert.equal(calls, 2);
    t.mock.timers.tick(10000);
    await tick();
    assert.equal(calls, 3);
    check.dispose();
});
test('college is absent for arbitrary slugs and exists only within a resolved college route', () => {
    assert.equal(collegeForPath('/private-title/notes/item'), undefined);
    const release = registerCollege('real-college');
    assert.equal(collegeForPath('/real-college/notes/item'), 'real-college');
    assert.equal(collegeForPath('/other/notes/item'), undefined);
    assert.equal(collegeForPath('/real-college-copy/notes/item'), undefined);
    release();
    assert.equal(collegeForPath('/real-college/notes/item'), undefined);
});
test('PYQ and Notes keep one tracker above every document state branch', () => {
    for (const [folder, param, component] of [
        ['pyqs', 'pyq', 'Pyq'],
        ['notes', 'note', 'Notes'],
    ]) {
        const source = fs.readFileSync(
            `src/app/[slug]/${folder}/[${param}-slug]/${component}DetailClient.tsx`,
            'utf8',
        );
        assert.equal((source.match(/<TrackContentView\b/g) || []).length, 1);
        assert.match(
            source,
            new RegExp(`export default function ${component}DetailClient`),
        );
    }
});

for (const status of [200, 401])
    test(`slow auth ${status} applies after readiness without aborting or duplicating requests`, async (t) => {
        t.mock.timers.enable({ apis: ['setTimeout'] });
        let ready = 0,
            calls = 0,
            finish,
            result;
        const check = startAuthCheck({
            url: '/auth/user',
            ready: () => ready++,
            signedIn: (user) => {
                result = user;
            },
            signedOut: () => {
                result = null;
            },
            fetcher: async (_url, options) => {
                calls++;
                assert.equal(options.signal, undefined);
                return new Promise((resolve) => {
                    finish = resolve;
                });
            },
        });
        t.mock.timers.tick(5000);
        assert.equal(ready, 1);
        check.resume();
        t.mock.timers.tick(30000);
        assert.equal(calls, 1);
        const account = { _id: '507f1f77bcf86cd799439011' };
        finish({ status, ok: status === 200, json: async () => account });
        await tick();
        assert.deepEqual(result, status === 200 ? account : null);
        check.resume();
        await tick();
        assert.equal(calls, 1);
        check.dispose();
    });
test('late auth responses cannot update an unmounted provider', async () => {
    let finish;
    const check = startAuthCheck({
        url: '/auth/user',
        ready: () => assert.fail('disposed'),
        signedIn: () => assert.fail('disposed'),
        signedOut: () => assert.fail('disposed'),
        fetcher: async () =>
            new Promise((resolve) => {
                finish = resolve;
            }),
    });
    check.dispose();
    finish({ status: 401, ok: false });
    await tick();
});
test('scroll touches activity at most once a second and focused video keeps a 40 minute lecture active', () => {
    const { activityHandlers } = require('../src/analytics/browserActivity.ts');
    const { AnalyticsQueue } = require('../src/analytics/core.ts');
    let now = 1000000,
        touches = 0,
        id = 0;
    const scroll = activityHandlers(
        { activity: () => touches++, heartbeat() {} },
        () => now,
    );
    for (let i = 0; i < 100; i++) scroll.scroll();
    assert.equal(touches, 1);
    now += 999;
    scroll.scroll();
    assert.equal(touches, 1);
    now++;
    scroll.scroll();
    assert.equal(touches, 2);
    const queue = new AnalyticsQueue({
        anonId: 'a'.repeat(32),
        platform: 'web',
        now: () => now,
        id: () => String(++id).padStart(32, '0'),
        persist() {},
        waitForIdentity: true,
        send: async () => ({ status: 204 }),
    });
    queue.screen('/[slug]/videos/[video]');
    const session = queue.session;
    const activity = activityHandlers(queue, () => now);
    for (let i = 0; i < 80; i++) {
        now += 30000;
        activity.tick(true, 'IFRAME');
    }
    assert.equal(queue.session, session);
    assert.equal(
        queue.snapshot.events.filter((event) => event.name === 'session_start')
            .length,
        1,
    );
    now += 1800000;
    activity.tick(false, 'IFRAME');
    queue.activity();
    assert.notEqual(queue.session, session);
});
test('college registry matches encoded slugs and rejects invalid encodings', () => {
    const release = registerCollege('real%2Dcollege');
    assert.equal(collegeForPath('/real%2Dcollege/notes'), 'real-college');
    assert.equal(collegeForPath('/real-college/notes'), 'real-college');
    assert.equal(collegeForPath('/bad%zz/notes'), undefined);
    release();
});
test('encoded college lookup keeps sections only for the decoded real college', async () => {
    const Module = require('node:module');
    const filename = require.resolve('../src/utils/collegeSections.ts');
    const loaded = new Module(filename, module);
    loaded.require = (name) =>
        name === '@/config/apiUrls'
            ? {
                  api: {
                      college: {
                          getCollegeBySlug: (slug) => `/colleges/${slug}`,
                      },
                  },
              }
            : require(name);
    loaded._compile(
        ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
            compilerOptions: { module: ts.ModuleKind.CommonJS },
        }).outputText,
        filename,
    );
    const previous = global.fetch;
    global.fetch = async () => ({
        ok: true,
        json: async () => ({
            data: {
                _id: '507f1f77bcf86cd799439011',
                slug: 'real-college',
                sections: { notes: false },
            },
        }),
    });
    try {
        assert.equal(
            (await loaded.exports.getCollegeSections('real%2Dcollege')).notes,
            false,
        );
        assert.equal(
            await loaded.exports.getCollegeSections('different-college'),
            null,
        );
    } finally {
        global.fetch = previous;
    }
});
test('every list search skips the initial URL query', () => {
    const files = [
        'store/StoreClient.tsx',
        'lost-found/LostFoundClient.tsx',
        'groups/WhatsAppGroupClient.tsx',
        'opportunities/OpportunityClient.tsx',
        'seniors/SeniorClient.tsx',
        'quicknotes/QuickNotesClient.tsx',
        'pyqs/PyqsClient.tsx',
        'notes/NotesClient.tsx',
        'videos/VideosClient.tsx',
        'syllabus/SyllabusClient.tsx',
    ];
    for (const file of files)
        assert.match(
            fs.readFileSync(`src/app/[slug]/${file}`, 'utf8'),
            /useSearchTracker\(\s*'\w+',\s*[\w.]+,\s*true\s*,?\s*\)/,
        );
});

test('AnalyticsProvider is gated by rehydration and mounts before the hydrated college subtree', () => {
    const Module = require('node:module');
    const React = require('react');
    const { PersistGate } = require('redux-persist/integration/react');
    const filename = require.resolve('../src/components/Providers.tsx');
    const loaded = new Module(filename, module);
    const analytics = () => null;
    loaded.require = (name) => {
        if (name === 'react')
            return { ...React, useState: () => [false, () => {}] };
        if (name === '@/analytics/AnalyticsProvider')
            return { __esModule: true, default: analytics };
        if (name === '@/analytics/IdentifyBridge')
            return { __esModule: true, default: () => null };
        if (name === '@/redux/store') return { store: {}, persistor: {} };
        if (name === './AuthCheck') return { UserInitProvider: () => null };
        return require(name);
    };
    loaded._compile(
        ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
            compilerOptions: {
                module: ts.ModuleKind.CommonJS,
                jsx: ts.JsxEmit.ReactJSX,
            },
        }).outputText,
        filename,
    );
    const collegeTree = React.createElement('main', { id: 'college-layout' });
    const provider = loaded.exports.default({ children: collegeTree });
    const gateElement = provider.props.children;
    assert.equal(gateElement.type, PersistGate);
    const gate = new PersistGate(gateElement.props);
    assert.equal(gate.render(), null);
    gate.state = { bootstrapped: true };
    const hydrated = React.Children.toArray(gate.render());
    assert.equal(hydrated[0].type, analytics);
    assert.equal(hydrated.at(-1).props.id, 'college-layout');
    assert.ok(
        !fs
            .readFileSync('src/app/layout.tsx', 'utf8')
            .includes('<AnalyticsProvider'),
    );
});

test('product query totals ignore categories and settle on Enter, blur and result selection', () => {
    const Module = require('node:module');
    const React = require('react');
    const {
        SearchTracker,
        searchTotal,
    } = require('../src/analytics/search.ts');
    const filename = require.resolve('../src/app/products/ProductList.tsx');
    const loaded = new Module(filename, module);
    let state = [],
        cursor = 0,
        tracker;
    const effects = [],
        events = [];
    loaded.require = (name) => {
        if (name === 'react')
            return {
                ...React,
                useState(initial) {
                    const index = cursor++;
                    if (!(index in state)) state[index] = initial;
                    return [
                        state[index],
                        (value) => {
                            state[index] = value;
                        },
                    ];
                },
                useMemo: (fn) => fn(),
                useCallback: (fn) => fn,
                useEffect: (fn) => {
                    effects.push(fn);
                },
            };
        if (name === '@/analytics')
            return { analytics: { track: (...args) => events.push(args) } };
        if (name === '@/analytics/share')
            return require('../src/analytics/share.ts');
        if (name === '@/analytics/search')
            return require('../src/analytics/search.ts');
        if (name === '@/analytics/useSearchTracker')
            return {
                useSearchTracker(scope, query, skipInitial) {
                    if (!tracker)
                        tracker = new SearchTracker(query, skipInitial);
                    tracker.update(query);
                    return (query, total) => {
                        const props = tracker.settle(query, searchTotal(total));
                        if (props) events.push(['search', { scope, ...props }]);
                    };
                },
            };
        if (name === 'next/navigation')
            return {
                useSearchParams: () => new URLSearchParams('search=book'),
            };
        if (name === '@/config/apiUrls')
            return {
                api: { affiliateProducts: { trackClick: () => '/unused' } },
            };
        return require(name);
    };
    loaded._compile(
        ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
            compilerOptions: {
                module: ts.ModuleKind.CommonJS,
                jsx: ts.JsxEmit.ReactJSX,
                esModuleInterop: true,
            },
        }).outputText,
        filename,
    );
    const products = [
        {
            _id: 'a',
            name: 'Books Alpha',
            description: '',
            tags: [],
            category: 'A',
            image: '',
            price: 1,
        },
        {
            _id: 'b',
            name: 'Books Beta',
            description: '',
            tags: [],
            category: 'B',
            image: '',
            price: 2,
        },
    ];
    const render = () => {
        cursor = 0;
        return loaded.exports.default({ initialProducts: products });
    };
    const find = (node, predicate) => {
        if (!node || typeof node !== 'object') return;
        if (predicate(node)) return node;
        for (const child of React.Children.toArray(node.props?.children)) {
            const result = find(child, predicate);
            if (result) return result;
        }
    };
    let tree = render();
    let input = find(tree, (node) => node.type === 'input');
    input.props.onBlur();
    assert.equal(events.length, 0); // Shared-link query.
    input.props.onChange({ target: { value: 'books' } });
    tree = render();
    const select = find(tree, (node) => node.type === 'select');
    if (select) select.props.onChange({ target: { value: 'B' } });
    else state[1] = 'B';
    tree = render();
    input = find(tree, (node) => node.type === 'input');
    input.props.onKeyDown({ key: 'Enter' });
    input.props.onBlur();
    assert.deepEqual(events, [
        ['search', { scope: 'affiliate', queryLength: 5, resultCount: 2 }],
    ]);
    assert.match(
        fs.readFileSync(filename, 'utf8'),
        /handleProductClick[\s\S]*?settleSearch\(\)/,
    );
});

for (const status of [200, 401])
    test(`late startup ${status} cannot overwrite a newer explicit auth change`, async (t) => {
        t.mock.timers.enable({ apis: ['setTimeout'] });
        const { configureStore } = require('@reduxjs/toolkit');
        const user = require('../src/redux/slices/userSlice.ts');
        const { watchAuthChanges } = require('../src/analytics/authCheck.ts');
        const store = configureStore({ reducer: { user: user.default } });
        const oldAccount = { _id: 'old-account', username: 'old' };
        const newAccount = { _id: 'new-account', username: 'new' };
        if (status === 200) store.dispatch(user.signInSuccess(oldAccount));
        const auth = watchAuthChanges(store);
        let finish,
            ready = 0;
        const check = startAuthCheck({
            url: '/auth/user',
            authRevision: auth.revision,
            ready: () => ready++,
            signedIn: (value) => store.dispatch(user.signInSuccess(value)),
            signedOut: () => store.dispatch(user.signOut()),
            fetcher: async () =>
                new Promise((resolve) => {
                    finish = resolve;
                }),
        });
        t.mock.timers.tick(5000);
        assert.equal(ready, 1);
        store.dispatch(
            status === 401 ? user.signInSuccess(newAccount) : user.signOut(),
        );
        finish({ status, ok: status === 200, json: async () => oldAccount });
        await tick();
        assert.deepEqual(
            store.getState().user.currentUser,
            status === 401 ? newAccount : null,
        );
        check.dispose();
        auth.unsubscribe();
    });

test('mobile visibility resume renews the tab lease without a pageshow event', async (t) => {
    t.mock.timers.enable({ apis: ['Date'], now: 1000000 });
    const keys = ['window', 'document', 'navigator', 'location', 'fetch'];
    const saved = Object.fromEntries(
        keys.map((key) => [
            key,
            Object.getOwnPropertyDescriptor(globalThis, key),
        ]),
    );
    const values = new Map(),
        listeners = new Map();
    const storage = {
        get length() {
            return values.size;
        },
        key: (index) => [...values.keys()][index] || null,
        getItem: (key) => values.get(key) || null,
        setItem: (key, value) => values.set(key, value),
        removeItem: (key) => values.delete(key),
    };
    const document = {
        cookie: '',
        visibilityState: 'visible',
        activeElement: null,
        addEventListener: (key, fn) => listeners.set(key, fn),
        removeEventListener: (key) => listeners.delete(key),
    };
    const replacements = {
        window: {
            localStorage: storage,
            setInterval: () => 1,
            clearInterval() {},
            addEventListener: (key, fn) => listeners.set(key, fn),
            removeEventListener: (key) => listeners.delete(key),
        },
        document,
        navigator: { sendBeacon: () => false },
        location: { protocol: 'http:' },
        fetch: async () => ({ status: 204, headers: new Headers() }),
    };
    for (const [key, value] of Object.entries(replacements))
        Object.defineProperty(globalThis, key, {
            configurable: true,
            writable: true,
            value,
        });
    try {
        const { analytics } = require('../src/analytics/index.ts');
        const stop = analytics.start();
        analytics.identify(null);
        await analytics.flush();
        const lease = [...values.keys()].find((key) => key.includes(':lease:'));
        assert.ok(lease);
        document.visibilityState = 'hidden';
        listeners.get('visibilitychange')();
        t.mock.timers.setTime(1100000);
        assert.ok(Number(JSON.parse(values.get(lease))) < Date.now());
        document.visibilityState = 'visible';
        listeners.get('visibilitychange')();
        assert.ok(Number(JSON.parse(values.get(lease))) > Date.now());
        await analytics.flush();
        stop();
    } finally {
        for (const key of keys) {
            if (saved[key]) Object.defineProperty(globalThis, key, saved[key]);
            else delete globalThis[key];
        }
    }
});
