export interface User {
    _id: string;
    username: string;
    email: string;
    college: string;
    phone: string;
    profilePicture: string;
}

export interface UserState {
    currentUser: User;
    loading: boolean;
    error: string | null;
}

export interface Transaction {
    id: string;
    amount: number;
    type: string;
    date: string;
    description: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    dateAdded: string;
}

export interface PYQ {
    id: string;
    subject: string;
    year: string;
    university: string;
    dateAdded: string;
}

export interface Note {
    id: string;
    title: string;
    subject: string;
    university: string;
    dateAdded: string;
}

export interface UserData {
    wallet: {
        currentBalance: number;
        totalEarning: number;
        totalWithdrawal: number;
    };
    userTransaction: Transaction[];
    userProductAdd: Product[];
    userPyqAdd: PYQ[];
    userNoteAdd: Note[];
}

export interface FormData {
    username?: string;
    email?: string;
    college?: string;
    phone?: string;
    password?: string;
    profilePicture?: string;
}
