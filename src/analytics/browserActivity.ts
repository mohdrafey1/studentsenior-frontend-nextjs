/** Scroll can fire hundreds of times per second; one touch per second is enough. */
export function activityHandlers(
    queue: { activity(): unknown; heartbeat(): void },
    now = Date.now,
) {
    let lastScroll = -Infinity;
    return {
        interaction: () => {
            queue.activity();
        },
        scroll: () => {
            if (now() - lastScroll < 1000) return;
            lastScroll = now();
            queue.activity();
        },
        tick: (visible: boolean, activeTag?: string) => {
            if (!visible) return;
            if (activeTag === 'IFRAME') queue.activity();
            queue.heartbeat();
        },
    };
}
