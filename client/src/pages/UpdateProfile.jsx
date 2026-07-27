import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { updateProfile, updateProfileImage } from "../features/user/userApi";
import { setUser } from "../features/auth/authSlice";

import React from 'react';

const UpdateProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);

    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        bio: "",
    });

    const [profileImage, setProfileImage] = useState(null);

    const [preview, setPreview] = useState(null);

    const [loading, setLoading] = useState(false);

    const inputRef = useRef(null);

    const hasChanges =
        profileImage ||
        formData.username !== user.username ||
        formData.fullName !== user.fullName ||
        formData.bio !== (user.bio || "");



    useEffect(() => {
        if (!user) return;

        setFormData({
            username: user.username,
            fullName: user.fullName,
            bio: user.bio || "",
        });

        setPreview(user.profileImage);
    }, [user]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!hasChanges) return;

            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [hasChanges]);


    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleImage = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setProfileImage(file);

        setPreview(URL.createObjectURL(file));
    };

    
    const handleSubmit = async () => {
        try {
            setLoading(true);

            const updates = {};

            // Check changed fields
            if (formData.username.trim() !== user.username) {
                updates.username = formData.username.trim();
            }

            if (formData.fullName.trim() !== user.fullName) {
                updates.fullName = formData.fullName.trim();
            }

            if (formData.bio !== (user.bio || "")) {
                updates.bio = formData.bio.trim();
            }

            let updatedUser = user;

            // Upload profile image
            if (profileImage) {
                const formDataImage = new FormData();
                formDataImage.append("profileImage", profileImage);

                const res = await updateProfileImage(formDataImage);

                updatedUser = res.data.data;
            }

            // Update profile details
            if (Object.keys(updates).length > 0) {
                const res = await updateProfile(updates);

                updatedUser = res.data.data;
            }

            if (
                !profileImage &&
                Object.keys(updates).length === 0
            ) {
                toast.info("No changes detected.");
                return;
            }

            dispatch(setUser(updatedUser));

            toast.success("Profile updated successfully!");
            navigate(`/profile`);

            setProfileImage(null);
        } catch (error) {
            // setLoading(false)
            toast.error(
                error?.response?.data?.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (hasChanges) {
            const confirmLeave = window.confirm(
                "You have unsaved changes. Leave without saving?"
            );

            if (!confirmLeave) return;
        }

        navigate(-1);
    };
    return (
        <div className="max-w-2xl mx-auto py-10 px-6">

            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-3xl border border-border p-8"
            >

                <h1 className="text-3xl font-bold">
                    Edit Profile
                </h1>

                <p className="text-subtext mt-2">
                    Update your personal information.
                </p>

                {/* Avatar */}

                <div className="mt-10 flex flex-col items-center">

                    <div className="relative">

                        <img
                            src={preview}
                            alt=""
                            className="w-32 h-32 rounded-full object-cover ring-2 ring-primary/60"
                        />

                        <button
                            type="button"
                            onClick={() => inputRef.current.click()}
                            className="absolute bottom-1 right-1
                       bg-primary
                       text-white
                       rounded-full
                       p-2"
                        >
                            <Camera size={18} />
                        </button>

                        <input
                            ref={inputRef}
                            hidden
                            accept="image/*"
                            type="file"
                            onChange={handleImage}
                        />

                    </div>

                </div>

                {/* Username */}

                <div className="mt-8">

                    <label className="font-medium">
                        Username
                    </label>

                    <input
                        maxLength={30}
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-2 w-full bg-bg rounded-xl border border-border p-3 outline-none focus:ring-2 focus:ring-primary/60"
                    />

                </div>

                {/* Full Name */}

                <div className="mt-6">

                    <label className="font-medium">
                        Full Name
                    </label>

                    <input
                        maxLength={50}
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="mt-2 w-full bg-bg rounded-xl border border-border p-3 outline-none focus:ring-2 focus:ring-primary/60"
                    />

                </div>

                {/* Bio */}

                <div className="mt-6">

                    <label className="font-medium">
                        Bio
                    </label>

                    <textarea
                        rows={5}
                        maxLength={150}
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="mt-2 w-full resize-none bg-bg rounded-xl border border-border p-3 outline-none focus:ring-2 focus:ring-primary/60"
                    />

                    <p className="text-right text-subtext text-sm mt-2">
                        {formData.bio.length}/150
                    </p>

                </div>

                {/* Buttons */}

                <div className="flex justify-end gap-4 mt-8">

                    <button
                        onClick={handleCancel}
                        className="px-5 py-3 rounded-xl border border-border"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!hasChanges || loading}
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>

                </div>

            </motion.div>

        </div>
    );
}

export default UpdateProfile;
