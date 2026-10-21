export interface CategorizedGalleryItem {
  category: string | null;
}

export interface GalleryGroup<T extends CategorizedGalleryItem> {
  category: string;
  items: T[];
}

export const GALLERY_CATEGORY_ORDER = [
  "Wedding",
  "Birthday",
  "Corporate",
  "Traditional",
  "Other",
];

export function groupGalleryItems<T extends CategorizedGalleryItem>(
  items: T[]
): GalleryGroup<T>[] {
  const groups = new Map<string, GalleryGroup<T>>();

  for (const item of items) {
    const category = item.category?.trim() || "Other";
    const knownCategory = GALLERY_CATEGORY_ORDER.find(
      (known) => known.toLowerCase() === category.toLowerCase()
    );
    const displayCategory = knownCategory ?? category;
    const key = displayCategory.toLowerCase();
    const group = groups.get(key);

    if (group) {
      group.items.push(item);
    } else {
      groups.set(key, {
        category: displayCategory,
        items: [item],
      });
    }
  }

  return [...groups.values()].sort((a, b) => {
    const aOrder = GALLERY_CATEGORY_ORDER.indexOf(a.category);
    const bOrder = GALLERY_CATEGORY_ORDER.indexOf(b.category);

    if (aOrder !== -1 || bOrder !== -1) {
      if (aOrder === -1) return 1;
      if (bOrder === -1) return -1;
      return aOrder - bOrder;
    }

    return a.category.localeCompare(b.category);
  });
}
