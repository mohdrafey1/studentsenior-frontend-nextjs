"use client";

import React, { useState } from "react";
import { CollegeData } from "@/utils/interface";
import { api } from "@/config/apiUrls";

export default function AddCollegePage() {
    const [isSuccess, setIsSuccess] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [collegeData, setCollegeData] = useState<CollegeData>({
        name: "",
        location: "",
        description: "",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setCollegeData({ ...collegeData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${api.college.addCollege}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(collegeData),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                setResponseMessage(
                    data.message || "College added successfully!"
                );
                setIsSuccess(true);
                setCollegeData({ name: "", location: "", description: "" });
            } else {
                setResponseMessage(
                    `Failed to add college: ${
                        data.message || "Something went wrong"
                    }`
                );
                setIsSuccess(true);
            }
        } catch (error) {
            setResponseMessage(
                `Failed to add college: ${
                    error instanceof Error ? error.message : "Network error"
                }`
            );
            setIsSuccess(true);
        } finally {
            setLoading(false);
        }
    };

    const closeDialog = () => {
        setIsSuccess(false);
        window.location.href = "/";
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-50 bg-opacity-75 dark:bg-opacity-75">
                    <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"></div>
                </div>
            )}

            <div
                className={`${
                    isSuccess ? "block" : "hidden"
                } text-center absolute bg-opacity-80 bg-gray-300 dark:bg-gray-700 flex justify-center h-full w-full z-50 items-center`}
            >
                <div
                    role="alert"
                    className="mt-3 relative flex flex-col max-w-sm p-3 text-sm text-white bg-black dark:bg-gray-800 rounded-md"
                >
                    <p className="flex justify-center text-2xl">Attention</p>
                    <p className="ml-4 p-3">{responseMessage}</p>

                    <button
                        className="flex items-center justify-center transition-all w-8 h-8 rounded-md text-white hover:bg-white/10 active:bg-white/10 absolute top-1.5 right-1.5"
                        type="button"
                        onClick={closeDialog}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-5 w-5"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div className="container mx-auto p-4 bg-gradient-to-t from-sky-200 dark:from-sky-900 to bg-white dark:to-gray-900 min-h-max lg:min-h-screen min-w-full">
                <div className="big-screen w-full lg:flex self-center rounded-lg mt-4 mb-4">
                    <div className="illustration w-full">
                        <iframe
                            className="w-full h-full"
                            src="https://lottie.host/embed/13b6a2bb-8ee5-485e-a88d-ed9c5b3f6977/b9HuPP23fO.json"
                        ></iframe>
                    </div>
                    <div className="formData w-full pl-8 pr-8">
                        <form
                            onSubmit={handleSubmit}
                            className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-gray-900/20"
                        >
                            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                                <span className="heading-class">
                                    Add New College
                                </span>
                            </h1>

                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
                                    htmlFor="name"
                                >
                                    College Name
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    id="name"
                                    placeholder="Enter College Name"
                                    maxLength={100}
                                    value={collegeData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
                                    htmlFor="location"
                                >
                                    Location
                                </label>
                                <input
                                    name="location"
                                    type="text"
                                    id="location"
                                    placeholder="Enter College Location"
                                    maxLength={100}
                                    value={collegeData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
                                    htmlFor="description"
                                >
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    placeholder="Enter College Description"
                                    maxLength={500}
                                    value={collegeData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    rows={4}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Submitting..." : "Submit College"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
