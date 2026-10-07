// Only the layout that successfully resolved a college can register its slug.
const resolved = new Set<string>();
export function registerCollege(slug: string) {
    if (!/^[a-z\d-]{1,100}$/.test(slug)) return () => undefined;
    resolved.add(slug);
    return () => {
        resolved.delete(slug);
    };
}
export function collegeForPath(pathname?: string): string | undefined {
    const segment = pathname?.split('/')[1];
    return segment && resolved.has(segment) ? segment : undefined;
}
