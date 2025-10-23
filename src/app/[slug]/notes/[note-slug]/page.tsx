import { api } from '@/config/apiUrls';
import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import NotesDetailClient from './NotesDetailClient';

interface NoteDetailPageProps {
    params: Promise<{ 'note-slug': string }>;
}

export async function generateMetadata({
  params,
}: NoteDetailPageProps): Promise<Metadata> {
  const { 'note-slug': noteSlug } = await params;

  const title = `${capitalizeWords(noteSlug)} - Notes`;
  const description = 'High-quality notes to boost your learning efficiency.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: '/image192edge.png',
          width: 800,
          height: 600,
          alt: title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/image192edge.png'],
    },
  };
}


export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
    const { 'note-slug': noteSlug } = await params;

    let note = null;

    try {
        const url = `${api.notes.getNoteBySlug(noteSlug)}`;
        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        note = data?.data || null;
    } catch (error) {
        console.error('Error fetching note details:', error);
    }

    if (!note) {
        return (
            <main className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
                <div className='text-center py-12'>
                    <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        Note Not Found
                    </h1>
                    <p className='text-gray-600 dark:text-gray-300'>
                        The Note you&apos;re looking for doesn&apos;t exist or
                        has been removed.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main>
            <NotesDetailClient note={note} />
        </main>
    );
}
