
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type GalleryItem = {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  is_featured: boolean;
  is_active: boolean;
};

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

        setGalleryItems(
          data.gallery ?? data.data ?? []
        );
      } catch (error) {
        console.error(
          "Failed to fetch gallery:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, []);

  const previewItems = galleryItems.slice(0, 4);

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

          {galleryItems.length > 4 && (
            <Link
              href="/gallery"
              className={
                isDark
                  ? "inline-block border border-white/15 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  : "inline-block border border-[#D4AF37]/60 px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#171717] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              }
            >
              View More
            </Link>
          )}
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
        ) : previewItems.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {previewItems.map((item) => (
              <div
                key={item.id}
                className={
                  isDark
                    ? "group overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#171717]"
                    : "group overflow-hidden rounded-[1.5rem] border border-[#E7DCCE] bg-[#F8F5F1]"
                }
              >
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                </div>

                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                    {item.category ?? "Featured"}
                  </p>

                  <h3 className="mt-3 text-xl font-medium text-current">
                    {item.title}
                  </h3>
                </div>
              </div>
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

