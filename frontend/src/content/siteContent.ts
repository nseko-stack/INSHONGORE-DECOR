export type Service = {
  id: string;
  title: string;
  description: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  image: string;
  alt: string;
};

export const siteContent = {
  brand: {
    name: "Inshongore Bridal Dress",
    shortName: "Inshongore Decor",
  },
  hero: {
    eyebrow: "Wedding Fashion · Clothes Rental · Consultations · Decoration",
    description:
      "We offer wedding clothes rental, thoughtful consultations, and atmospheric event decoration for meaningful celebrations.",
  },
  about: {
    description:
      "Inshongore Decor brings together wedding clothes rental, personal consultations, and elegant event decoration. We help you make confident choices and create celebrations that feel personal, polished, and unforgettable.",
    secondaryDescription:
      "From selecting the right look to designing the atmosphere around it, we blend artistry and practical guidance to shape moments that feel warm, expressive, and beautifully memorable.",
    highlights: [
      { value: "2+", label: "years styling" },
      { value: "50+", label: "events styled" },
      { value: "100%", label: "tailored detail" },
    ],
  },
  services: [
    {
      id: "wedding-clothes-rental",
      title: "Wedding Clothes Rental",
      description:
        "Discover carefully selected wedding dresses and occasion looks for a polished, memorable celebration.",
    },
    {
      id: "consultations",
      title: "Consultations",
      description:
        "Bring us your vision and receive thoughtful guidance on outfits, styling, timelines, and the details that bring everything together.",
    },
    {
      id: "event-decorations",
      title: "Event Decorations",
      description:
        "Transform your venue with elegant decor, floral details, tablescapes, and an atmosphere designed around your occasion.",
    },
    {
      id: "wedding-styling",
      title: "Wedding Styling",
      description:
        "Create a cohesive celebration with refined styling direction, personal details, and a visual story that feels like you.",
    },
    {
      id: "special-occasion-styling",
      title: "Special Occasion Styling",
      description:
        "From birthdays to intimate gatherings, we help you style meaningful moments with beauty, warmth, and intention.",
    },
  ] satisfies Service[],
  gallery: [
    {
      id: "floral-styling",
      title: "Floral styling",
      image: "/decor.jpg",
      alt: "Floral event styling",
    },
    {
      id: "wedding-details",
      title: "Wedding details",
      image: "/download (1).jfif",
      alt: "Wedding details",
    },
    {
      id: "atmosphere",
      title: "Atmosphere",
      image: "/decor.jpg",
      alt: "Decorated event atmosphere",
    },
    {
      id: "luxury-tables",
      title: "Luxury tables",
      image: "/download (1).jfif",
      alt: "Luxury table styling",
    },
    {
      id: "event-styling",
      title: "Event styling",
      image: "/decor.jpg",
      alt: "Event styling details",
    },
    {
      id: "tablescapes",
      title: "Tablescapes",
      image: "/download (1).jfif",
      alt: "Elegant tablescape",
    },
  ] satisfies GalleryItem[],
};

export const services = siteContent.services;
export const galleryItems = siteContent.gallery;
