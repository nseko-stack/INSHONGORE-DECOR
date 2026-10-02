"use client";

import { ChangeEvent, useState } from "react";

interface GalleryUploadProps {
  item?: {
    id: number;
    title: string;
    category: string;
    description: string;
    isFeatured: boolean;
    isActive: boolean;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function GalleryUpload({
  item,
  onClose,
  onSuccess,
}: GalleryUploadProps) {
  const [file, setFile] =
    useState<File | null>(null);

  const [title, setTitle] =
    useState(item?.title ?? "");

  const [description, setDescription] =
    useState(item?.description ?? "");

  const [category, setCategory] =
    useState(item?.category ?? "");

  const [isFeatured, setIsFeatured] =
    useState(item?.isFeatured ?? false);

  const [isActive, setIsActive] =
    useState(item?.isActive ?? true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0] ?? null;

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError(
        "Only JPG, PNG, and WEBP images are allowed."
      );

      setFile(null);

      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError(
        "Image must be smaller than 5MB."
      );

      setFile(null);

      return;
    }

    setError("");
    setFile(selectedFile);
  }

  async function handleSubmit() {
    if (!item && !file) {
      setError("Please select an image.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a project title.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      let response: Response;

      if (item) {
        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        formData.append("category", category.trim());
        formData.append("is_featured", String(isFeatured));
        formData.append("is_active", String(isActive));

        if (file) {
          formData.append("image", file);
        }

        response = await fetch(`${API_URL}/api/gallery/${item.id}`, {
          method: "PATCH",
          credentials: "include",
          body: formData,
        });
      } else {
        const formData = new FormData();
        formData.append("image", file!);
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        formData.append("category", category);
        formData.append("is_featured", String(isFeatured));

        response = await fetch(
          `${API_URL}/api/gallery`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to upload image"
        );
      }

      /*
       * The backend has successfully:
       *
       * 1. Uploaded the image to Supabase Storage
       * 2. Created the gallery record
       *    in PostgreSQL
       *
       * Refresh the gallery page.
       */
      onSuccess();
    } catch (error) {
      console.error(
        "Gallery upload error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload image"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="my-2 flex max-h-[calc(100dvh-1rem)] w-full max-w-lg flex-col overflow-hidden border border-white/10 bg-[#111111] text-white shadow-2xl sm:my-0 sm:max-h-[calc(100dvh-3rem)]">

        {/* HEADER */}
        <div className="flex shrink-0 items-start justify-between border-b border-white/10 px-5 py-5 sm:px-8 sm:py-6">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
              Gallery content
            </p>

            <h2 className="text-xl font-medium sm:text-2xl">
              {item ? "Edit Gallery Image" : "Add Gallery Image"}
            </h2>

            <p className="mt-1 text-xs leading-5 text-white/45 sm:text-sm sm:leading-6">
              {item
                ? "Update the project details in your gallery."
                : "Upload a new project to your gallery."}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="ml-4 text-2xl leading-none text-white/35 transition hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
          <div className="space-y-4 sm:space-y-5">

            {/* ERROR */}
            {error && (
              <div className="border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-xs text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* IMAGE */}
            {!item && <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-white/65">
                Image
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-white/20 bg-white/[0.02] px-6 py-8 text-center transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 sm:py-10">

                <span className="text-2xl text-[#D4AF37]">
                  ↑
                </span>

                <span className="mt-3 max-w-full truncate text-sm font-medium text-white/85">
                  {file
                    ? file.name
                    : "Choose an image"}
                </span>

                <span className="mt-1 text-xs text-white/35">
                  JPG, PNG or WEBP • Max 5MB
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="hidden"
                />
              </label>
            </div>}

            {item && (
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-white/40">
                  Replace Image
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white/60 file:mr-4 file:border-0 file:bg-[#D4AF37]/10 file:px-4 file:py-2 file:text-[10px] file:uppercase file:tracking-[0.12em] file:text-[#D4AF37]"
                />

                <p className="mt-2 text-[10px] text-white/25">
                  JPEG, PNG or WebP. Maximum 5MB.
                </p>
              </div>
            )}

            {/* TITLE */}
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-white/65">
                Project title
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Elegant Garden Wedding"
                disabled={loading}
                className="w-full rounded-none border border-white/15 border-l-[#D4AF37] bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-white/65">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Describe this decoration project..."
                disabled={loading}
                rows={3}
                className="w-full resize-none rounded-none border border-white/15 border-l-[#D4AF37] bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-white/65">
                Category
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                disabled={loading}
                className="w-full rounded-none border border-white/15 border-l-[#D4AF37] bg-[#171717] px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]"
              >
                <option value="">
                  Select category
                </option>

                <option value="Wedding">
                  Wedding
                </option>

                <option value="Birthday">
                  Birthday
                </option>

                <option value="Corporate">
                  Corporate
                </option>

                <option value="Traditional">
                  Traditional
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* FEATURED */}
            <label className="flex cursor-pointer items-center gap-3 border border-white/10 bg-white/[0.02] px-4 py-3">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(event) =>
                  setIsFeatured(
                    event.target.checked
                  )
                }
                disabled={loading}
                className="h-4 w-4 accent-[#D4AF37]"
              />

              <div>
                <p className="text-xs font-medium text-white/80">
                  Featured project
                </p>

                <p className="mt-1 text-[10px] text-white/35">
                  Highlight this project on the
                  public gallery.
                </p>
              </div>
            </label>

            {item && (
              <label className="flex cursor-pointer items-center gap-3 border border-white/10 bg-white/[0.02] px-4 py-3">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(event) =>
                    setIsActive(event.target.checked)
                  }
                  disabled={loading}
                  className="h-4 w-4 accent-[#D4AF37]"
                />

                <div>
                  <p className="text-xs font-medium text-white/80">
                    Active project
                  </p>
                  <p className="mt-1 text-[10px] text-white/35">
                    Inactive projects are hidden from the public gallery.
                  </p>
                </div>
              </label>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:pt-6">

              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 border border-white/15 px-4 py-3 text-xs uppercase tracking-[0.16em] text-white/65 transition hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={
                  (!item && !file) ||
                  !title.trim() ||
                  !category ||
                  loading
                }
                className="flex-1 border border-[#D4AF37] bg-[#D4AF37] px-4 py-3 text-xs uppercase tracking-[0.16em] text-black transition hover:bg-transparent hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10 disabled:text-white/30"
              >
                {loading
                  ? "Uploading..."
                  : item
                    ? "Save Changes"
                    : "Upload Image"}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
