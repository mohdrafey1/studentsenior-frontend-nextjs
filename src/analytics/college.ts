// Only the layout that successfully resolved a college can register its slug.
const resolved = new Set<string>();
export function registerCollege(slug: string) {
    try {
        slug = decodeURIComponent(slug);
    } catch {
        return () => undefined;
    }
    if (!/^[a-z\d-]{1,100}$/.test(slug)) return () => undefined;
    resolved.add(slug);
    return () => {
        resolved.delete(slug);
    };
}
export function collegeForPath(pathname?: string): string | undefined {
    let segment = pathname?.split('/')[1];
    try {
        segment = segment && decodeURIComponent(segment);
    } catch {
        return undefined;
    }
    return segment && resolved.has(segment) ? segment : undefined;
}
