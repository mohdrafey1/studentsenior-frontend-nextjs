/** A failed network check must not leave analytics waiting indefinitely. */
export function startAuthCheck(options: {
    url: string;
    signedOut: () => void;
    signedIn: (user: unknown) => void;
    ready: () => void;
    fetcher?: typeof fetch;
    authRevision?: () => number;
    currentUserId?: () => string | null;
    prepareIdentityChange?: () => Promise<void>;
    cancelIdentityChange?: () => void;
}) {
    let readyReleased = false;
    const ready = () => {
        readyReleased = true;
        options.ready();
    };
    let settled = false;
    let pending = false;
    let disposed = false;
    let retry: ReturnType<typeof setTimeout> | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const check = async () => {
        if (settled || pending || disposed) return;
        clearTimeout(retry);
        pending = true;
        let preparingIdentity = false;
        const revision = options.authRevision?.();
        const stale = () => disposed || options.authRevision?.() !== revision;
        timeout = setTimeout(() => {
            if (!disposed) ready();
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
            const signedOut = [401, 403, 404].includes(response.status);
            if (!signedOut && !response.ok)
                throw new Error('Auth check unavailable');
            const user = signedOut ? null : await response.json();
            const id = user && typeof user._id === 'string' ? user._id : null;
            if (stale()) {
                settled = true;
                return;
            }
            if (
                readyReleased &&
                options.currentUserId &&
                id !== options.currentUserId()
            ) {
                preparingIdentity = true;
                await options.prepareIdentityChange?.();
                // A newer login/logout may complete while the bounded queue drain runs.
                if (stale()) {
                    options.cancelIdentityChange?.();
                    settled = true;
                    return;
                }
            }
            settled = true;
            if (signedOut) options.signedOut();
            else options.signedIn(user);
        } catch {
            if (preparingIdentity) options.cancelIdentityChange?.();
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
            if (!disposed) ready();
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
