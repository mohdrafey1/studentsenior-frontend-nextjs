export function capitalizeWords(str: unknown): string {
    if (!str) return '';

    if (typeof str !== 'string') {
        if (typeof str === 'object' && str !== null) {
            const obj = str as Record<string, unknown>;
            if (typeof obj.name === 'string') return capitalizeWords(obj.name);
            if (typeof obj.slug === 'string') return capitalizeWords(obj.slug);
            if (typeof obj.title === 'string') return capitalizeWords(obj.title);
        }
        return String(str);
    }

    return str
        .split('-')
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(' ');
}

export function formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}
