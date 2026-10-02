
"use client";

import { useState } from "react";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  isFeatured: boolean;
  isActive: boolean;
}

interface GalleryEditProps {
  item: GalleryItem;
  onClose: () => void;
  onSuccess: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function GalleryEdit({
  item,
  onClose,
  onSuccess,
}: GalleryEditProps) {
  const [title, setTitle] = useState(
    item.title
  );

  const [description, setDescription] =
    useState(item.description);

  const [category, setCategory] = useState(
    item.category
  );

  const [isFeatured, setIsFeatured] =
    useState(item.isFeatured);

  const [isActive, setIsActive] =
    useState(item.isActive);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [image, setImage] =
    useState<File | null>(null);
    
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/gallery/${item.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            category: category.trim(),
            is_featured: isFeatured,
            is_active: isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to update gallery image"
        );
      }

      onSuccess();
    } catch (error) {
      console.error(
        "Failed to update gallery image:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update gallery image"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="w-full max-w-lg border border-white/10 bg-[#111111]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-[#D4AF37]">
              Gallery
            </p>

            <h2 className="mt-1 text-lg font-medium text-white/90">
              Edit Artwork
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-white/30 transition hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {error && (
            <div className="border border-red-500/20 bg-red-500/10 px-4 py-3">
              <p className="text-xs text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Preview */}
          <div className="overflow-hidden border border-white/10">
            <img
              src={item.image}
              alt={item.title}
              className="h-48 w-full object-cover"
            />
          </div>

          {/* Title */}
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-white/40">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
              className="w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/50"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-white/40">
              Category
            </label>

            <input
              type="text"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-white/40">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={4}
              className="w-full resize-none border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/50"
            />
          </div>

          {/* Featured */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(event) =>
                setIsFeatured(
                  event.target.checked
                )
              }
              className="h-4 w-4 accent-[#D4AF37]"
            />

            <span className="text-xs text-white/60">
              Featured artwork
            </span>
          </label>

          {/* Active */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) =>
                setIsActive(
                  event.target.checked
                )
              }
              className="h-4 w-4 accent-[#D4AF37]"
            />

            <span className="text-xs text-white/60">
              Active artwork
            </span>
          </label>

          {/* Buttons */}
          <div className="flex justify-end gap-4 border-t border-white/5 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="text-[10px] uppercase tracking-[0.16em] text-white/40 transition hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-5 py-2.5 text-[10px] uppercase tracking-[0.16em] text-[#D4AF37] transition hover:bg-[#D4AF37]/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
