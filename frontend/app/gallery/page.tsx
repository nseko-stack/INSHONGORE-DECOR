
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { groupGalleryItems } from "@/src/lib/gallery";

interface GalleryItem {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function GalleryPage() {
  const [gallery, setGallery] = useState<
    GalleryItem[]
  >([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const galleryGroups = groupGalleryItems(gallery);
  const selectedGroup = galleryGroups.find(
    (group) =>
      group.category.toLowerCase() ===
      selectedCategory?.toLowerCase()
  );

  useEffect(() => {
    async function fetchGallery() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/gallery`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ??
              "Failed to fetch gallery"
          );
        }

        setGallery(
          data.gallery ??
            data.data ??
            []
        );
        setSelectedCategory(
          new URLSearchParams(window.location.search).get("category")
        );
      } catch (error) {
        console.error(
          "Failed to fetch gallery:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load gallery"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F1EA] text-[#171717]">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10">
        {/* Header */}
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Our Gallery
        </p>

        <h1 className="mt-5 max-w-3xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          {selectedGroup
            ? `${selectedGroup.category} Gallery`
            : "Explore our work by category."}
        </h1>

        {/* Loading */}
        {loading && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-[1.75rem] border border-[#EADFCB] bg-white"
                >
                  <div className="aspect-[4/3] bg-[#EADFCB]" />

                  <div className="p-6">
                    <div className="h-3 w-20 rounded bg-[#EADFCB]" />

                    <div className="mt-3 h-6 w-2/3 rounded bg-[#EADFCB]" />

                    <div className="mt-4 h-4 rounded bg-[#EADFCB]" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-12 border border-red-200 bg-red-50 px-6 py-5">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Gallery */}
        {!loading &&
          !error &&
          galleryGroups.length > 0 &&
          !selectedCategory && (
            <div className="mt-12 space-y-16">
              {galleryGroups.map((group) => (
                <a
                  key={group.category}
                  href={`/gallery?category=${encodeURIComponent(group.category)}`}
                  className="group block overflow-hidden rounded-[1.75rem] border border-[#EADFCB] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative aspect-[16/8] overflow-hidden bg-[#EADFCB]">
                    <img
                      src={group.items[0].image_url}
                      alt={`${group.category} category`}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white sm:p-8">
                      <div>
                        <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
                          {group.category}
                        </h2>
                        <p className="mt-2 text-sm text-white/75">
                          {group.items.length}{" "}
                          {group.items.length === 1 ? "photo" : "photos"}
                        </p>
                      </div>
                      <span className="border border-white/70 px-4 py-2 text-[10px] uppercase tracking-[0.18em] transition group-hover:border-[#D4AF37] group-hover:text-[#D4AF37]">
                        View category
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

        {!loading &&
          !error &&
          selectedCategory &&
          (selectedGroup ? (
            <section className="mt-12">
              <a
                href="/gallery"
                className="mb-8 inline-block border border-[#D4AF37] px-5 py-3 text-xs uppercase tracking-[0.2em] transition hover:bg-[#D4AF37] hover:text-black"
              >
                All categories
              </a>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {selectedGroup.items.map((item) => (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-[1.75rem] border border-[#EADFCB] bg-white shadow-sm"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#EADFCB]">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      {item.is_featured && (
                        <div className="absolute left-4 top-4 rounded-full border border-[#D4AF37]/50 bg-black/70 px-3 py-1.5 backdrop-blur-sm">
                          <span className="text-[9px] uppercase tracking-[0.16em] text-[#D4AF37]">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h2 className="text-xl font-medium text-[#171717]">
                        {item.title}
                      </h2>
                      {item.description && (
                        <p className="mt-3 text-sm leading-7 text-[#4D443D]">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : (
            <div className="mt-12 rounded-[1.75rem] border border-[#EADFCB] bg-white px-6 py-16 text-center">
              <p className="text-sm text-[#4D443D]">
                No photos found in this category.
              </p>
              <a
                href="/gallery"
                className="mt-5 inline-block text-xs uppercase tracking-[0.2em] text-[#9B7925] underline underline-offset-4"
              >
                Browse all categories
              </a>
            </div>
          ))}

        {/* Empty */}
        {!loading &&
          !error &&
          gallery.length === 0 && (
            <div className="mt-12 rounded-[1.75rem] border border-[#EADFCB] bg-white px-6 py-16 text-center">
              <p className="text-sm text-[#4D443D]">
                Our gallery is being updated.
              </p>
            </div>
          )}

        {/* Back */}
        {!selectedCategory && (
          <div className="mt-12">
            <Link
              href="/"
              className="inline-block border border-[#D4AF37] bg-[#D4AF37] px-6 py-3 text-xs uppercase tracking-[0.2em] text-black transition hover:bg-transparent hover:text-[#D4AF37]"
            >
              Back Home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
