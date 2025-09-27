import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/config/apiUrls';

// Types
interface Transaction {
    id: string;
    points: number;
    type:
        | 'earn'
        | 'redeem'
        | 'reduction'
        | 'bonus'
        | 'pyq-purchase'
        | 'note-purchase'
        | 'add-point'
        | 'pyq-sale'
        | 'note-sale';
    createdAt: string;
    resourceType: string;
    resourceId: string;
}
interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    createdAt: string;
    college: {
        slug: string;
    };
    slug: string;
    description: string;
    submissionStatus: string;
    rejectionReason?: string;
}
interface PYQ {
    id: string;
    subject: {
        subjectName: string;
    };
    year: string;
    college: {
        slug: string;
        name: string;
    };
    slug: string;

    createdAt: string;
    examType: string;
    submissionStatus: string;
    rejectionReason?: string;
}
interface Note {
    id: string;
    title: string;
    createdAt: string;
    college: {
        slug: string;
        name: string;
    };
    slug: string;
    description: string;
    subject: {
        subjectName: string;
    };
    submissionStatus: string;
    rejectionReason?: string;
}
export interface UserDataState {
    rewardPoints: number;
    rewardBalance: number;
    rewardRedeemed: number;
    userTransaction: Transaction[];
    userProductAdd: Product[];
    userPyqAdd: PYQ[];
    userNoteAdd: Note[];
    loading: boolean;
    error: string | null;
}

// Async thunk to fetch user data
export const fetchUserData = createAsyncThunk<
    UserDataState,
    void,
    { rejectValue: string }
>('userData/fetchUserData', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch(`${api.user.userData}`, {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();

        if (!response.ok || data.success === false) {
            throw new Error(data.message || 'Failed to fetch user data');
        }

        console.log(data);

        return {
            rewardPoints: data.data.rewardPoints,
            rewardBalance: data.data.rewardBalance,
            rewardRedeemed: data.data.rewardRedeemed,
            userTransaction: data.data.transactions,
            userProductAdd: data.data.productsAdded,
            userPyqAdd: data.data.pyqAdded,
            userNoteAdd: data.data.notesAdded,
            loading: false,
            error: null,
        };
    } catch (error) {
        return rejectWithValue(
            error instanceof Error
                ? error.message
                : 'An unknown error occurred',
        );
    }
});

const initialState: UserDataState = {
    rewardPoints: 0,
    rewardBalance: 0,
    rewardRedeemed: 0,
    userTransaction: [],
    userProductAdd: [],
    userPyqAdd: [],
    userNoteAdd: [],
    loading: false,
    error: null,
};

const userDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchUserData.fulfilled,
                (state, action: PayloadAction<UserDataState>) => {
                    state.rewardPoints = action.payload.rewardPoints;
                    state.rewardBalance = action.payload.rewardBalance;
                    state.rewardRedeemed = action.payload.rewardRedeemed;
                    state.userTransaction = action.payload.userTransaction;
                    state.userProductAdd = action.payload.userProductAdd;
                    state.userPyqAdd = action.payload.userPyqAdd;
                    state.userNoteAdd = action.payload.userNoteAdd;
                    state.loading = false;
                    state.error = null;
                },
            )
            .addCase(fetchUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch user data';
            });
    },
});

export default userDataSlice.reducer;
