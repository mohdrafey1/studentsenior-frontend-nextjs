import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/config/apiUrls';
import type { IPyq, INote } from '@/utils/interface';

type SavedPyqEntry = {
    pyqId: IPyq | string;
    savedAt?: string;
};

type SavedNoteEntry = {
    noteId: INote | string;
    savedAt?: string;
};

type SavedCollectionPayload = {
    savedPYQs: SavedPyqEntry[];
    savedNotes: SavedNoteEntry[];
    purchasedPYQs: IPyq[];
    purchasedNotes: INote[];
};

type FetchError = { message: string; status: number } | string;

export const fetchSavedCollection = createAsyncThunk<
    SavedCollectionPayload,
    void,
    { rejectValue: FetchError }
>('savedCollection/fetchSavedCollection', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch(`${api.savedData.savedCollection}`, {
            method: 'GET',
            credentials: 'include',
        });

        const json = await response.json();

        if (!response.ok || json?.success === false) {
            return rejectWithValue({
                message: json?.message || 'Failed to fetch saved collection',
                status: json?.statusCode || response.status,
            });
        }

        const payload = json?.data || {};

        return {
            savedPYQs: payload.savedPYQs || [],
            savedNotes: payload.savedNotes || [],
            purchasedPYQs: payload.purchasedPYQs || [],
            purchasedNotes: payload.purchasedNotes || [],
        } as SavedCollectionPayload;
    } catch (error) {
        return rejectWithValue(
            error instanceof Error
                ? error.message
                : 'An unknown error occurred',
        );
    }
});

interface SavedCollectionState {
    savedPYQs: SavedPyqEntry[];
    savedNotes: SavedNoteEntry[];
    purchasedPYQs: IPyq[];
    purchasedNotes: INote[];
    loading: boolean;
    error: string | null;
}

const initialState: SavedCollectionState = {
    savedPYQs: [],
    savedNotes: [],
    purchasedPYQs: [],
    purchasedNotes: [],
    loading: false,
    error: null,
};

const savedCollectionSlice = createSlice({
    name: 'savedCollection',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSavedCollection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSavedCollection.fulfilled, (state, action) => {
                state.savedPYQs = action.payload.savedPYQs;
                state.savedNotes = action.payload.savedNotes;
                state.purchasedPYQs = action.payload.purchasedPYQs;
                state.purchasedNotes = action.payload.purchasedNotes;
                state.loading = false;
            })
            .addCase(fetchSavedCollection.rejected, (state, action) => {
                state.loading = false;
                const payload = action.payload;
                state.error =
                    typeof payload === 'string'
                        ? payload
                        : (payload as { message?: string } | undefined)
                              ?.message || 'Failed to fetch saved collection';
            });
    },
});

export default savedCollectionSlice.reducer;
