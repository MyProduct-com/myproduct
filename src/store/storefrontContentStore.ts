import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface HeroSlide {
  id: string;
  image: string;
}

export interface TestimonialCard {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;       // image URL — empty shows an initials circle instead
  borderRadius: number;  // px
  bg: string;            // empty falls back to theme.surface
  textColor: string;     // empty falls back to theme defaults
}

export interface FooterSocial {
  id: string;
  label: string;
  url: string;
}

export interface StorefrontContent {
  hero: {
    title: string;    // empty falls back to "Welcome to {shopName}"
    ctaText: string;
    slides: HeroSlide[];
  };
  about: {
    title: string;    // empty falls back to "About {shopName}"
    description: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: { title: string; desc: string }[];
  };
  testimonials: TestimonialCard[];
  contact: {
    phone: string;
    whatsapp: string;
  };
  footer: {
    socials: FooterSocial[];
    bg: string;   // empty falls back to theme.primary
    text: string; // empty falls back to white
  };
}

const genId = () => Math.random().toString(36).slice(2, 10);

export const DEFAULT_STOREFRONT_CONTENT: StorefrontContent = {
  hero: {
    title: "",
    ctaText: "Shop Now",
    slides: [
      { id: genId(), image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=1600&q=80&auto=format&fit=crop" },
      { id: genId(), image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=1600&q=80&auto=format&fit=crop" },
      { id: genId(), image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=1600&q=80&auto=format&fit=crop" },
      { id: genId(), image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=1600&q=80&auto=format&fit=crop" },
    ],
  },
  about: {
    title: "",
    description: "Every product on our shelves is picked, packed, and delivered with care — so you get the freshest quality, every single time.",
  },
  howItWorks: {
    title: "How your order gets to you",
    subtitle: "Three steps, same day — from sourcing straight to your door.",
    steps: [
      { title: "Order", desc: "Pick what you need and check out in under a minute — no account required." },
      { title: "Pick & Pack", desc: "Your order is pulled fresh and packed at our local hub within the hour." },
      { title: "Deliver", desc: "A rider brings it to your door the same day, tracked start to finish." },
    ],
  },
  testimonials: [
    { id: genId(), quote: "I order every week now — the quality is consistently good and delivery's never once been late.", name: "Wanjiru M.", role: "Kilimani", avatar: "", borderRadius: 24, bg: "", textColor: "" },
    { id: genId(), quote: "Switched from the supermarket run entirely. My essentials land at my door before I've had my coffee.", name: "Brian O.", role: "Lavington", avatar: "", borderRadius: 24, bg: "", textColor: "" },
    { id: genId(), quote: "Free delivery over KSh 500 makes it a no-brainer for the weekly shop. Never disappointed.", name: "Achieng P.", role: "South B", avatar: "", borderRadius: 24, bg: "", textColor: "" },
    { id: genId(), quote: "Customer support actually responds. Had a mix-up with an order and it was sorted the same day.", name: "Kevin N.", role: "Westlands", avatar: "", borderRadius: 24, bg: "", textColor: "" },
    { id: genId(), quote: "Packaging is always neat and nothing arrives bruised or broken. Small thing, but it shows.", name: "Faith W.", role: "Karen", avatar: "", borderRadius: 24, bg: "", textColor: "" },
  ],
  contact: {
    phone: "+254 700 000 000",
    whatsapp: "+254 700 000 000",
  },
  footer: {
    socials: [],
    bg: "",
    text: "",
  },
};

interface StorefrontContentStore {
  content: StorefrontContent;

  setHero: (changes: Partial<StorefrontContent["hero"]>) => void;
  addSlide: (image: string) => void;
  updateSlide: (id: string, image: string) => void;
  removeSlide: (id: string) => void;

  setAbout: (changes: Partial<StorefrontContent["about"]>) => void;

  setHowItWorks: (changes: Partial<Pick<StorefrontContent["howItWorks"], "title" | "subtitle">>) => void;
  updateStep: (index: number, changes: Partial<{ title: string; desc: string }>) => void;

  addTestimonial: () => void;
  updateTestimonial: (id: string, changes: Partial<TestimonialCard>) => void;
  removeTestimonial: (id: string) => void;

  setContact: (changes: Partial<StorefrontContent["contact"]>) => void;

  addSocial: (label: string, url: string) => void;
  updateSocial: (id: string, changes: Partial<FooterSocial>) => void;
  removeSocial: (id: string) => void;
  setFooterColors: (changes: Partial<{ bg: string; text: string }>) => void;

  resetContent: () => void;
}

export const useStorefrontContentStore = create<StorefrontContentStore>()(
  persist(
    (set) => ({
      content: DEFAULT_STOREFRONT_CONTENT,

      setHero: (changes) =>
        set((s) => ({ content: { ...s.content, hero: { ...s.content.hero, ...changes } } })),

      addSlide: (image) =>
        set((s) => ({
          content: {
            ...s.content,
            hero: { ...s.content.hero, slides: [...s.content.hero.slides, { id: genId(), image }] },
          },
        })),

      updateSlide: (id, image) =>
        set((s) => ({
          content: {
            ...s.content,
            hero: {
              ...s.content.hero,
              slides: s.content.hero.slides.map((sl) => (sl.id === id ? { ...sl, image } : sl)),
            },
          },
        })),

      removeSlide: (id) =>
        set((s) => {
          if (s.content.hero.slides.length <= 2) return s;
          return {
            content: {
              ...s.content,
              hero: { ...s.content.hero, slides: s.content.hero.slides.filter((sl) => sl.id !== id) },
            },
          };
        }),

      setAbout: (changes) =>
        set((s) => ({ content: { ...s.content, about: { ...s.content.about, ...changes } } })),

      setHowItWorks: (changes) =>
        set((s) => ({ content: { ...s.content, howItWorks: { ...s.content.howItWorks, ...changes } } })),

      updateStep: (index, changes) =>
        set((s) => ({
          content: {
            ...s.content,
            howItWorks: {
              ...s.content.howItWorks,
              steps: s.content.howItWorks.steps.map((step, i) => (i === index ? { ...step, ...changes } : step)),
            },
          },
        })),

      addTestimonial: () =>
        set((s) => ({
          content: {
            ...s.content,
            testimonials: [
              ...s.content.testimonials,
              { id: genId(), quote: "", name: "", role: "", avatar: "", borderRadius: 24, bg: "", textColor: "" },
            ],
          },
        })),

      updateTestimonial: (id, changes) =>
        set((s) => ({
          content: {
            ...s.content,
            testimonials: s.content.testimonials.map((t) => (t.id === id ? { ...t, ...changes } : t)),
          },
        })),

      removeTestimonial: (id) =>
        set((s) => ({
          content: { ...s.content, testimonials: s.content.testimonials.filter((t) => t.id !== id) },
        })),

      setContact: (changes) =>
        set((s) => ({ content: { ...s.content, contact: { ...s.content.contact, ...changes } } })),

      addSocial: (label, url) =>
        set((s) => ({
          content: {
            ...s.content,
            footer: { ...s.content.footer, socials: [...s.content.footer.socials, { id: genId(), label, url }] },
          },
        })),

      updateSocial: (id, changes) =>
        set((s) => ({
          content: {
            ...s.content,
            footer: {
              ...s.content.footer,
              socials: s.content.footer.socials.map((soc) => (soc.id === id ? { ...soc, ...changes } : soc)),
            },
          },
        })),

      removeSocial: (id) =>
        set((s) => ({
          content: {
            ...s.content,
            footer: { ...s.content.footer, socials: s.content.footer.socials.filter((soc) => soc.id !== id) },
          },
        })),

      setFooterColors: (changes) =>
        set((s) => ({ content: { ...s.content, footer: { ...s.content.footer, ...changes } } })),

      resetContent: () => set({ content: DEFAULT_STOREFRONT_CONTENT }),
    }),
    { name: "shop-storefront-content" }
  )
);
