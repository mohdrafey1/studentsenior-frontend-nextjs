export function capitalizeWords(str: string | any): string {
    if (!str) return '';

    if (typeof str !== 'string') {
        if (typeof str === 'object') {
            if (typeof str.name === 'string') return capitalizeWords(str.name);
            if (typeof str.slug === 'string') return capitalizeWords(str.slug);
            if (typeof str.title === 'string') return capitalizeWords(str.title);
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
