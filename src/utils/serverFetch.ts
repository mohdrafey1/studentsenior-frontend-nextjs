import { notFound } from 'next/navigation';

// Preserve an upstream outage as an error so Next renders its retry boundary.
// Only an actual API 404 is treated as missing content.
export async function fetchPublicApi(input: string, init?: RequestInit) {
    const response = await fetch(input, { ...init, signal: init?.signal || AbortSignal.timeout(15_000) });
    if (response.status === 404) notFound();
    if (!response.ok) throw new Error('Content is temporarily unavailable');
    const payload = await response.clone().json();
    if (payload?.success === false) throw new Error('Content is temporarily unavailable');
    return response;
}
