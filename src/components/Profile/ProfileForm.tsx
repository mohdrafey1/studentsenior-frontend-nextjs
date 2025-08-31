"use client";

import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import toast from "react-hot-toast";
import { api } from "@/config/apiUrls";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "@/redux/slices/userSlice";

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

interface FormData {
  username?: string;
  email?: string;
  college?: string;
  phone?: string;
  password?: string;
  profilePicture?: string;
}

interface ProfileFormProps {
  onSignOut: () => void;
}

export default function ProfileForm({ onSignOut }: ProfileFormProps) {
  const dispatch = useDispatch();
  const fileRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({});
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  const { currentUser, loading, error } = useSelector(
    (state: { user: UserState }) => state.user
  );

  const uploadImageToS3 = async (file: File): Promise<string> => {
    try {
      const fileName = `public/ss-profiles/${Date.now()}-${file.name.replace(
        /[^a-zA-Z0-9.-]/g,
        ""
      )}`;
      const fileType = file.type;

      // Get presigned URL
      const presignedRes = await fetch(api.aws.presignedUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ fileName, fileType }),
      });

      if (!presignedRes.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl, key } = await presignedRes.json();

      // Upload to S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": fileType },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image");
      }

      // Return the CloudFront URL
      return `https://dixu7g0y1r80v.cloudfront.net/${key}`;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageLoading(true);
    const loadingToast = toast.loading("Uploading image...");
    try {
      const url = await uploadImageToS3(file);
      setFormData((prev) => ({ ...prev, profilePicture: url }));
      toast.success("Image uploaded successfully, Click Update Profile");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setImageLoading(false);
      toast.dismiss(loadingToast);
    }
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

  const togglePass = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-fugaz font-semibold text-center mb-8 text-gray-900 dark:text-white">
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
            onChange={handleImageChange}
            disabled={imageLoading}
          />
          <div className="relative">
            {currentUser.profilePicture || formData.profilePicture ? (
              <Image
                src={formData.profilePicture || currentUser.profilePicture}
                alt="profile"
                width={128}
                height={128}
                priority
                className="h-32 w-32 cursor-pointer rounded-full object-cover border-4 border-blue-300 dark:border-blue-600"
                onClick={() => fileRef.current?.click()}
              />
            ) : (
              <div
                className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-full border-4 border-blue-300 bg-gray-100 dark:border-blue-600 dark:bg-gray-700"
                onClick={() => fileRef.current?.click()}
              >
                <span className="text-4xl text-gray-400">👤</span>
              </div>
            )}
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
          {imageLoading && (
            <span className="text-blue-600 dark:text-blue-400">
              Uploading...
            </span>
          )}
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
              type={passwordShown ? "text" : "password"}
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
          onClick={onSignOut}
          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
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
  );
}
