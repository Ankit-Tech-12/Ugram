import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { Camera, Loader2, AlertCircle, X } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { updateProfile, updateProfileImage } from "../features/user/userApi";
import { setUser } from "../features/auth/authSlice";

const USERNAME_REGEX = /^[a-zA-Z0-9._]{3,30}$/;
const MAX_IMAGE_MB = 5;

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

  // field-level errors, shown inline instead of only as a toast
  const [errors, setErrors] = useState({});

  const inputRef = useRef(null);

  const hasChanges =
    profileImage ||
    formData.username !== user.username.trim() ||
    formData.fullName !== user.fullName.trim() ||
    formData.bio.trim() !== (user.bio || "").trim();

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

  // avoid leaking object URLs when the component unmounts with a
  // locally-picked (not yet saved) image still in preview
  useEffect(() => {
    return () => {
      if (profileImage && preview) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear that field's error as soon as the user edits it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImage = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setErrors((prev) => ({ ...prev, image: "Please choose an image file." }));
    e.target.value = "";
    return;
  }

  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    setErrors((prev) => ({
      ...prev,
      image: `Image must be under ${MAX_IMAGE_MB}MB.`,
    }));
    e.target.value = "";
    return;
  }

  setErrors((prev) => ({ ...prev, image: undefined }));

  if (profileImage && preview) URL.revokeObjectURL(preview);

  setProfileImage(file);
  setPreview(URL.createObjectURL(file));

  // reset so selecting the same file again still fires onChange next time
  e.target.value = "";
};

  const validate = () => {
    const next = {};
    const uname = formData.username.trim();

    if (!uname) {
      next.username = "Username is required.";
    } else if (!USERNAME_REGEX.test(uname)) {
      next.username = "3–30 characters: letters, numbers, . or _ only.";
    }

    if (!formData.fullName.trim()) {
      next.fullName = "Full name is required.";
    }

    return next;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...validationErrors }));
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setLoading(true);

      const updates = {};

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

      if (profileImage) {
        const formDataImage = new FormData();
        formDataImage.append("profileImage", profileImage);

        const res = await updateProfileImage(formDataImage);
        updatedUser = res.data.data;
      }

      if (Object.keys(updates).length > 0) {
        const res = await updateProfile(updates);
        updatedUser = res.data.data;
      }

      if (!profileImage && Object.keys(updates).length === 0) {
        toast.info("No changes detected.");
        return;
      }

      dispatch(setUser(updatedUser));

      toast.success("Profile updated successfully!");
      navigate(`/profile`);

      setProfileImage(null);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Something went wrong. Please try again.";

      // if the backend flags a specific field, surface it inline too
      const field = error?.response?.data?.field;
      if (field && ["username", "fullName", "bio"].includes(field)) {
        setErrors((prev) => ({ ...prev, [field]: message }));
      }

      toast.error(message);
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-[28px] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-16px_rgba(0,0,0,0.18)] p-6 sm:p-9"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Edit profile
            </h1>
            <p className="text-subtext mt-1.5 text-sm">
              Update your personal information.
            </p>
          </div>

          <AnimatePresence>
            {hasChanges && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Unsaved
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className="mt-9 flex flex-col items-center">
          <div className="relative group">
            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="relative block rounded-full overflow-hidden"
            >
              <img
                src={preview}
                alt="Profile"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover"
              />
              {/* hover scrim, desktop only — mobile relies on the camera badge */}
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium">
                  Change photo
                </span>
              </div>
            </button>

            <span
              onClick={() => inputRef.current.click()}
              className="absolute bottom-0.5 right-0.5 bg-primary text-white rounded-full p-2 shadow-md cursor-pointer sm:hidden"
            >
              <Camera size={15} />
            </span>

            <input
              ref={inputRef}
              hidden
              accept="image/*"
              type="file"
              onChange={handleImage}
            />
          </div>

          {errors.image && (
            <p className="flex items-center gap-1 text-xs text-red-500 mt-3">
              <AlertCircle size={12} />
              {errors.image}
            </p>
          )}
        </div>

        {/* Username */}
        <div className="mt-9">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>

          <input
            id="username"
            maxLength={30}
            name="username"
            value={formData.username}
            onChange={handleChange}
            aria-invalid={!!errors.username}
            className={`mt-2 w-full bg-bg rounded-xl border p-3 text-sm outline-none transition-colors focus:ring-2 ${
              errors.username
                ? "border-red-400 focus:ring-red-300/60"
                : "border-border focus:ring-primary/50 focus:border-primary/50"
            }`}
          />

          {errors.username && (
            <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
              <AlertCircle size={12} />
              {errors.username}
            </p>
          )}
        </div>

        {/* Full Name */}
        <div className="mt-5">
          <label htmlFor="fullName" className="text-sm font-medium">
            Full name
          </label>

          <input
            id="fullName"
            maxLength={50}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            aria-invalid={!!errors.fullName}
            className={`mt-2 w-full bg-bg rounded-xl border p-3 text-sm outline-none transition-colors focus:ring-2 ${
              errors.fullName
                ? "border-red-400 focus:ring-red-300/60"
                : "border-border focus:ring-primary/50 focus:border-primary/50"
            }`}
          />

          {errors.fullName && (
            <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
              <AlertCircle size={12} />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Bio */}
        <div className="mt-5">
          <label htmlFor="bio" className="text-sm font-medium">
            Bio
          </label>

          <textarea
            id="bio"
            rows={4}
            maxLength={150}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell people a little about yourself"
            className="mt-2 w-full resize-none bg-bg rounded-xl border border-border p-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder:text-subtext/60"
          />

          <p className="text-right text-subtext text-xs mt-1.5 tabular-nums">
            {formData.bio.length}/150
          </p>
        </div>
      </motion.div>

      {/* Actions — floating glass bar on mobile, plain inline row on desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:static sm:z-auto sm:px-0 sm:pb-0 sm:mt-6">
        <div className="max-w-2xl mx-auto flex items-center justify-end gap-3 bg-card/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.25)] sm:bg-transparent sm:backdrop-blur-none sm:shadow-none sm:rounded-none sm:px-0 sm:py-0">
          {hasChanges && (
            <p className="hidden sm:block text-xs text-subtext mr-auto">
              You have unsaved changes
            </p>
          )}

          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 sm:px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-bg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            disabled={!hasChanges || loading}
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;