"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/utils/firebase";
import { api } from "@/config/apiUrls";
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    signOut,
} from "@/redux/slices/userSlice";
// import { fetchUserData } from "../redux/slices/userDataSlice";

// Types
interface User {
    _id: string;
    username: string;
    email: string;
    college: string;
    phone: string;
    profilePicture: string;
}

interface UserState {
    currentUser: User;
    loading: boolean;
    error: string | null;
}

interface UserData {
    rewardPoints: number;
    rewardBalance: number;
    rewardRedeemed: number;
    userTransaction: Transaction[];
    userProductAdd: Product[];
    userPyqAdd: PYQ[];
    userNoteAdd: Note[];
}

interface Transaction {
    id: string;
    amount: number;
    type: string;
    date: string;
    description: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    dateAdded: string;
}

interface PYQ {
    id: string;
    subject: string;
    year: string;
    university: string;
    dateAdded: string;
}

interface Note {
    id: string;
    title: string;
    subject: string;
    university: string;
    dateAdded: string;
}

interface FormData {
    username?: string;
    email?: string;
    college?: string;
    phone?: string;
    password?: string;
    profilePicture?: string;
}

// Tab Components
const OverviewTab: React.FC<{ data: UserData }> = ({ data }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Reward Points
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {data.rewardPoints || 0}
            </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Balance
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                ₹{data.rewardBalance || 0}
            </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Redeemed
            </h3>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                ₹{data.rewardRedeemed || 0}
            </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Total Items
            </h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {(data.userProductAdd?.length || 0) +
                    (data.userPyqAdd?.length || 0) +
                    (data.userNoteAdd?.length || 0)}
            </p>
        </div>
    </div>
);

const TransactionsTab: React.FC<{ transactions: Transaction[] }> = ({
    transactions,
}) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Transactions
            </h3>
        </div>
        <div className="p-6">
            {transactions && transactions.length > 0 ? (
                <div className="space-y-4">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {transaction.description}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(
                                        transaction.date
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <span
                                className={`font-bold ${
                                    transaction.type === "credit"
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                }`}
                            >
                                {transaction.type === "credit" ? "+" : "-"}₹
                                {transaction.amount}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No transactions found
                </p>
            )}
        </div>
    </div>
);

const ProductsTab: React.FC<{ products: Product[] }> = ({ products }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                My Products
            </h3>
        </div>
        <div className="p-6">
            {products && products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                {product.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                Category: {product.category}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                Added:{" "}
                                {new Date(
                                    product.dateAdded
                                ).toLocaleDateString()}
                            </p>
                            <p className="font-bold text-blue-600 dark:text-blue-400">
                                ₹{product.price}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No products found
                </p>
            )}
        </div>
    </div>
);

const NotesTab: React.FC<{ notes: Note[] }> = ({ notes }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                My Notes
            </h3>
        </div>
        <div className="p-6">
            {notes && notes.length > 0 ? (
                <div className="space-y-4">
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                {note.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                Subject: {note.subject}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                University: {note.university}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Added:{" "}
                                {new Date(note.dateAdded).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No notes found
                </p>
            )}
        </div>
    </div>
);

const PYQTab: React.FC<{ pyqs: PYQ[] }> = ({ pyqs }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Previous Year Questions
            </h3>
        </div>
        <div className="p-6">
            {pyqs && pyqs.length > 0 ? (
                <div className="space-y-4">
                    {pyqs.map((pyq) => (
                        <div
                            key={pyq.id}
                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                {pyq.subject} - {pyq.year}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                University: {pyq.university}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Added:{" "}
                                {new Date(pyq.dateAdded).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No PYQs found
                </p>
            )}
        </div>
    </div>
);

// Main Profile Component
export default function Profile() {
    const dispatch = useDispatch();
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);

    const [image, setImage] = useState<File | undefined>(undefined);
    const [imagePercent, setImagePercent] = useState<number>(0);
    const [imageError, setImageError] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({});
    const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [loading1, setLoading1] = useState<boolean>(false);
    const [passwordShown, setPasswordShown] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("overview");

    const { currentUser, loading, error } = useSelector(
        (state: { user: UserState }) => state.user
    );
    const userData = useSelector(
        (state: { userData: UserData }) => state.userData || {}
    );

    const { userTransaction, userProductAdd, userPyqAdd, userNoteAdd } =
        userData;

    useEffect(() => {
        if (image) {
            handleFileUpload(image);
        }
    }, [image]);

    // useEffect(() => {
    //     dispatch(fetchUserData());
    // }, [dispatch]);

    const handleFileUpload = async (image: File) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImagePercent(Math.round(progress));
            },
            (error) => {
                setImageError(true);
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData({ ...formData, profilePicture: downloadURL })
                );
            }
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`${api.user.update(currentUser._id)}`, {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();

            if (data.success === false) {
                dispatch(updateUserFailure(data));
                toast.error(data.message);
                return;
            }

            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
            toast.success("Profile Updated Successfully");
        } catch (error) {
            dispatch(updateUserFailure(error));
            toast.error("Something Went Wrong");
        }
    };

    const handleSignOut = async () => {
        try {
            setLoading1(true);
            const response = await fetch(`${api.auth.signout}`, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                dispatch(signOut());
                setLoading1(false);
                toast.success("You are Logout Now");
                router.push("/sign-in");
            } else {
                console.error("Signout failed:", response);
                toast.error("Signout failed");
            }
        } catch (error) {
            console.error("Signout error:", error);
            toast.error("Signout error");
        } finally {
            setLoading1(false);
        }
    };

    const togglePass = () => {
        setPasswordShown(!passwordShown);
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "transactions", label: "Transactions", icon: "💳" },
        { id: "products", label: "Products", icon: "🛍️" },
        { id: "notes", label: "Notes", icon: "📝" },
        { id: "pyqs", label: "PYQs", icon: "📋" },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "overview":
                return <OverviewTab data={userData} />;
            case "transactions":
                return <TransactionsTab transactions={userTransaction || []} />;
            case "products":
                return <ProductsTab products={userProductAdd || []} />;
            case "notes":
                return <NotesTab notes={userNoteAdd || []} />;
            case "pyqs":
                return <PYQTab pyqs={userPyqAdd || []} />;
            default:
                return <OverviewTab data={userData} />;
        }
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Logout Confirmation Dialog */}
            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded-lg lg:w-1/3 w-2/3 shadow-2xl">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                                <svg
                                    className="h-6 w-6 text-red-600 dark:text-red-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                    />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Sign Out
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        You&apos;ll need to log in again to
                                        access your account.
                                    </p>
                                </div>
                                <div className="flex py-4 gap-3 lg:justify-end justify-center">
                                    <button
                                        className="px-4 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                                        onClick={() => setShowDialog(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold text-white cursor-pointer disabled:opacity-50"
                                        onClick={handleSignOut}
                                        disabled={loading1}
                                    >
                                        {loading1 ? (
                                            <span className="flex items-center">
                                                <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Signing out...
                                            </span>
                                        ) : (
                                            "Sign Out"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row">
                {/* Profile Form Section */}
                <div className="lg:w-1/3 p-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-900 dark:text-white">
                            Profile
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Profile Picture */}
                            <div className="relative flex justify-center">
                                <input
                                    type="file"
                                    ref={fileRef}
                                    hidden
                                    accept="image/*"
                                    onChange={(e) =>
                                        setImage(e.target.files?.[0])
                                    }
                                />
                                <div className="relative">
                                    <Image
                                        src={
                                            formData.profilePicture ||
                                            currentUser.profilePicture
                                        }
                                        alt="profile"
                                        width={128}
                                        height={128}
                                        className="h-32 w-32 cursor-pointer rounded-full object-cover border-4 border-blue-300 dark:border-blue-600"
                                        onClick={() => fileRef.current?.click()}
                                    />
                                    <button
                                        type="button"
                                        className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors"
                                        onClick={() => fileRef.current?.click()}
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Upload Status */}
                            <div className="text-center text-sm">
                                {imageError ? (
                                    <span className="text-red-600 dark:text-red-400">
                                        Error uploading image (file size must be
                                        less than 2 MB)
                                    </span>
                                ) : imagePercent > 0 && imagePercent < 100 ? (
                                    <span className="text-blue-600 dark:text-blue-400">
                                        Uploading: {imagePercent}%
                                    </span>
                                ) : imagePercent === 100 ? (
                                    <span className="text-green-600 dark:text-green-400">
                                        Image uploaded successfully! Click
                                        update to save.
                                    </span>
                                ) : null}
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-4">
                                <input
                                    defaultValue={currentUser.username}
                                    type="text"
                                    id="username"
                                    placeholder="Username"
                                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onChange={handleChange}
                                />

                                <input
                                    defaultValue={currentUser.email}
                                    type="email"
                                    id="email"
                                    placeholder="Email"
                                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent opacity-60"
                                    onChange={handleChange}
                                    readOnly
                                />

                                <input
                                    defaultValue={currentUser.college}
                                    type="text"
                                    id="college"
                                    placeholder="College Name"
                                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onChange={handleChange}
                                />

                                <input
                                    defaultValue={currentUser.phone}
                                    type="tel"
                                    id="phone"
                                    placeholder="Please Enter 10 digit Mobile No"
                                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onChange={handleChange}
                                />

                                <div className="relative">
                                    <input
                                        type={
                                            passwordShown ? "text" : "password"
                                        }
                                        id="password"
                                        placeholder="Password"
                                        className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 pr-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                        onClick={togglePass}
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            {passwordShown ? (
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                                />
                                            ) : (
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            )}
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Profile"}
                            </button>
                        </form>

                        {/* Sign Out Button */}
                        <div className="flex justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setShowDialog(true)}
                                className=" text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                            >
                                Sign Out
                            </button>
                        </div>

                        {/* Status Messages */}
                        {error && (
                            <p className="text-red-600 dark:text-red-400 mt-4 text-center">
                                {error}
                            </p>
                        )}
                        {updateSuccess && (
                            <p className="text-green-600 dark:text-green-400 mt-4 text-center">
                                Profile updated successfully!
                            </p>
                        )}
                    </div>
                </div>

                {/* Profile Details Section with Tabs */}
                <div className="lg:w-2/3 p-6 overflow-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav className="flex space-x-8 px-6 pt-6">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === tab.id
                                                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                                        }`}
                                    >
                                        <span>{tab.icon}</span>
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">{renderTabContent()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
