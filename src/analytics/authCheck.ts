/** A failed network check must not leave analytics waiting indefinitely. */
export function startAuthCheck(options: {
    url: string;
    signedOut: () => void;
    signedIn: (user: unknown) => void;
    ready: () => void;
    fetcher?: typeof fetch;
    authRevision?: () => number;
}) {
    let settled = false;
    let pending = false;
    let disposed = false;
    let retry: ReturnType<typeof setTimeout> | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const check = async () => {
        if (settled || pending || disposed) return;
        clearTimeout(retry);
        pending = true;
        const revision = options.authRevision?.();
        const stale = () => disposed || options.authRevision?.() !== revision;
        timeout = setTimeout(() => {
            if (!disposed) options.ready();
        }, 5000);
        try {
            const response = await (options.fetcher || fetch)(options.url, {
                method: 'GET',
                credentials: 'include',
            });
            if (stale()) {
                settled = true;
                return;
            }
            if ([401, 403, 404].includes(response.status)) {
                settled = true;
                options.signedOut();
            } else if (response.ok) {
                const user = await response.json();
                if (stale()) {
                    settled = true;
                    return;
                }
                settled = true;
                options.signedIn(user);
            } else throw new Error('Auth check unavailable');
        } catch {
            // Preserve an existing local session through a temporary outage.
            if (!disposed) {
                clearTimeout(retry);
                retry = setTimeout(() => {
                    void check();
                }, 30000);
            }
        } finally {
            clearTimeout(timeout);
            pending = false;
            if (!disposed) options.ready();
        }
    };
    void check();
    return {
        resume: () => {
            void check();
        },
        dispose: () => {
            disposed = true;
            clearTimeout(retry);
            clearTimeout(timeout);
        },
    };
}

/** A later login/logout wins over the response to an earlier startup request. */
export function watchAuthChanges(store: {
    getState: () => { user: { currentUser: unknown } };
    subscribe: (listener: () => void) => () => void;
}) {
    let current = store.getState().user.currentUser;
    let revision = 0;
    const unsubscribe = store.subscribe(() => {
        const next = store.getState().user.currentUser;
        if (next !== current) {
            current = next;
            revision++;
        }
    });
    return { revision: () => revision, unsubscribe };
}
