/** A failed network check must not leave analytics waiting indefinitely. */
export function startAuthCheck(options: {
    url: string;
    signedOut: () => void;
    signedIn: (user: unknown) => void;
    ready: () => void;
    fetcher?: typeof fetch;
}) {
    let settled = false;
    let pending = false;
    let disposed = false;
    let retry: ReturnType<typeof setTimeout> | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    const check = async () => {
        if (settled || pending || disposed) return;
        clearTimeout(retry);
        pending = true;
        controller = new AbortController();
        const signal = controller.signal;
        timeout = setTimeout(() => {
            controller?.abort();
            if (!disposed) options.ready();
        }, 5000);
        try {
            const response = await (options.fetcher || fetch)(options.url, {
                method: 'GET',
                credentials: 'include',
                signal,
            });
            if (disposed || signal.aborted) return;
            if ([401, 403, 404].includes(response.status)) {
                settled = true;
                options.signedOut();
            } else if (response.ok) {
                const user = await response.json();
                if (disposed || signal.aborted) return;
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
            controller?.abort();
            clearTimeout(retry);
            clearTimeout(timeout);
        },
    };
}
