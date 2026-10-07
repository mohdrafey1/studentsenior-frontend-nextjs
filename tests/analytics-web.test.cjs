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
    assert.equal(signal.aborted, true);
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
