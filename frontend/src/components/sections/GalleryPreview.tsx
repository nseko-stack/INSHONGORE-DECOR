
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { galleryItems as fallbackGalleryItems } from "@/src/content/siteContent";
import {
  groupGalleryItems,
} from "@/src/lib/gallery";

type GalleryItem = {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  is_featured: boolean;
  is_active: boolean;
};

const fallbackGalleryData: GalleryItem[] = fallbackGalleryItems.map((item, index) => ({
  id: index + 1,
  title: item.title,
  description: item.alt,
  image_url: item.image,
  category: "Featured",
  is_featured: true,
  is_active: true,
}));

type GalleryPreviewProps = {
  isDark?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function GalleryPreview({
  isDark = false,
}: GalleryPreviewProps) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch(
          `${API_URL}/api/gallery`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ?? "Failed to fetch gallery"
          );
        }

        const fetchedGalleryItems = data.gallery ?? data.data ?? fallbackGalleryData;
        setGalleryItems(fetchedGalleryItems);
      } catch (error) {
        console.warn("Using fallback gallery data:", error);
        setGalleryItems(fallbackGalleryData);
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, []);

  const galleryGroups = groupGalleryItems(galleryItems);

  return (
    <section
      id="gallery"
      className={
        isDark
          ? "bg-[#111111] py-16 text-white sm:py-20 lg:py-24"
          : "bg-[#F7F2EB] py-16 text-[#171717] sm:py-20 lg:py-24"
      }
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
              Gallery
            </p>

            <h2 className="mt-5 max-w-xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
              A glimpse into the moments we style beautifully.
            </h2>
          </div>

        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className={
                  isDark
                    ? "h-[26rem] animate-pulse rounded-[1.5rem] bg-[#171717]"
                    : "h-[26rem] animate-pulse rounded-[1.5rem] bg-[#E7DCCE]"
                }
              />
            ))}
          </div>
        ) : galleryGroups.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryGroups.map((group) => (
              <Link
                key={group.category}
                href={`/gallery?category=${encodeURIComponent(group.category)}`}
                className={
                  isDark
                    ? "group overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#171717] transition hover:-translate-y-1"
                    : "group overflow-hidden rounded-[1.5rem] border border-[#E7DCCE] bg-[#F8F5F1] transition hover:-translate-y-1"
                }
              >
                <div className="relative h-64 overflow-hidden sm:h-72">
                  <Image
                    src={group.items[0].image_url}
                    alt={`${group.category} category`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
                    <div>
                      <h3 className="text-2xl font-medium">
                        {group.category}
                      </h3>
                      <p className="mt-2 text-xs text-white/75">
                        {group.items.length}{" "}
                        {group.items.length === 1 ? "photo" : "photos"}
                      </p>
                    </div>
                    <span className="shrink-0 border border-white/70 px-3 py-2 text-[9px] uppercase tracking-[0.15em] transition group-hover:border-[#D4AF37] group-hover:text-[#D4AF37]">
                      Open folder
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-[#E7DCCE] bg-[#F8F5F1] px-6 py-12 text-center">
            <p className="text-sm text-[#4D443D]">
              Our gallery is being updated.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
