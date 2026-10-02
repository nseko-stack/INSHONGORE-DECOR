
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

interface GalleryGridProps {
  items: GalleryItem[];
  onDelete: (id: number) => void;
  onRefresh: () => void;
  onEdit:(item: GalleryItem) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function GalleryGrid({
  items,
  onDelete,
  onRefresh,
  onEdit,
}: GalleryGridProps) {
  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  const [error, setError] = useState("");

  async function handleFeaturedToggle(
    item: GalleryItem
  ) {
    try {
      setUpdatingId(item.id);
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
            is_featured: !item.isFeatured,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to update featured status"
        );
      }

      await onRefresh();
    } catch (error) {
      console.error(
        "Failed to update featured status:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update featured status"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-6 border border-red-500/20 bg-red-500/10 px-5 py-3">
          <p className="text-xs text-red-400">
            {error}
          </p>
        </div>
      )}

      {items.length === 0 ? (
        <div className="border border-white/10 bg-[#111111] px-6 py-16 text-center">
          <p className="text-sm text-white/60">
            No gallery images yet.
          </p>

          <p className="mt-2 text-xs text-white/30">
            Upload your first artwork to display it
            here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden border border-white/10 bg-[#111111]"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                {/* Featured badge */}
                {item.isFeatured && (
                  <div className="absolute left-4 top-4 border border-[#D4AF37]/40 bg-black/80 px-3 py-1.5">
                    <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#D4AF37]">
                      Featured
                    </span>
                  </div>
                )}

                {/* Inactive badge */}
                {!item.isActive && (
                  <div className="absolute right-4 top-4 border border-white/10 bg-black/80 px-3 py-1.5">
                    <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-white/40">
                      Inactive
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-3">
                  <p className="text-[9px] uppercase tracking-[0.16em] text-[#D4AF37]/70">
                    {item.category}
                  </p>

                  <h3 className="mt-1 text-sm font-medium text-white/90">
                    {item.title}
                  </h3>
                </div>

                {item.description && (
                  <p className="line-clamp-2 text-xs leading-5 text-white/40">
                    {item.description}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                  <button
                    onClick={() =>
                      handleFeaturedToggle(item)
                    }
                    disabled={
                      updatingId === item.id
                    }
                    className={`text-[10px] uppercase tracking-[0.14em] transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      item.isFeatured
                        ? "text-[#D4AF37] hover:text-white"
                        : "text-white/40 hover:text-[#D4AF37]"
                    }`}
                  >
                    {updatingId === item.id
                      ? "Updating..."
                      : item.isFeatured
                        ? "Unfeature"
                        : "Feature"}
                  </button>

                  <button
                    onClick={() =>
                      onDelete(item.id)
                    }
                    disabled={
                      updatingId === item.id
                    }
                    className="text-[10px] uppercase tracking-[0.14em] text-white/40 transition hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    disabled={updatingId === item.id}
                    className="text-[10px] uppercase tracking-[0.14em] text-white/40 transition hover:text-[#D4AF37] disabled:opacity-40"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

