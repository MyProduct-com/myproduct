"use client";

import { useState } from "react";
import { Plus, X, RotateCcw } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useStorefrontContentStore } from "@/store/storefrontContentStore";
import { clampToDeepShade } from "@/lib/colorUtils";

interface PageContentTabProps {
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

const inputCls = "w-full px-3 py-2 rounded-org-sm border border-org-border text-org-sm bg-org-surface text-org-text-primary outline-none focus:border-org-primary";
const labelCls = "block text-org-xs font-org-medium text-org-text-secondary mb-1.5";
const cardCls = "bg-org-surface rounded-org-card shadow-org-card p-4";
const sectionTitleCls = "font-org-bold text-org-md text-org-text-primary mb-4";

export default function PageContentTab({ onToast }: PageContentTabProps) {
  const { theme, updateTheme } = useThemeStore();
  const {
    content,
    setHero, addSlide, updateSlide, removeSlide,
    setAbout,
    setHowItWorks, updateStep,
    addTestimonial, updateTestimonial, removeTestimonial,
    setContact,
    addSocial, updateSocial, removeSocial, setFooterColors,
    resetContent,
  } = useStorefrontContentStore();

  const [newSlideUrl, setNewSlideUrl] = useState("");
  const [newSocialLabel, setNewSocialLabel] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const save = (msg: string) => onToast(msg, "success");

  const radiusPx = parseInt(theme.radiusCard, 10) || 32;

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-org-sm text-org-text-secondary">
          Everything here is reflected live on your shop&apos;s public page. Changes save automatically.
        </p>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-org-sm border border-org-border text-org-xs font-org-medium text-org-text-secondary hover:bg-org-surface-alt transition-colors"
        >
          <RotateCcw size={13} /> Reset Page Content
        </button>
      </div>

      {/* ── Hero section ── */}
      <div className={cardCls}>
        <p className={sectionTitleCls}>Hero Section</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className={labelCls}>Title</label>
            <input
              value={content.hero.title}
              onChange={(e) => setHero({ title: e.target.value })}
              onBlur={() => save("Hero title saved.")}
              placeholder={`Welcome to ${theme.shopName}`}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>CTA Button Text</label>
            <input
              value={content.hero.ctaText}
              onChange={(e) => setHero({ ctaText: e.target.value })}
              onBlur={() => save("CTA text saved.")}
              placeholder="Shop Now"
              className={inputCls}
            />
          </div>
        </div>

        <label className={labelCls}>Slides ({content.hero.slides.length}) — minimum 2</label>
        <div className="space-y-2 mb-3">
          {content.hero.slides.map((slide) => (
            <div key={slide.id} className="flex items-center gap-2.5">
              <img src={slide.image} alt="" className="w-12 h-12 rounded-org-sm object-cover shrink-0 border border-org-border" />
              <input
                value={slide.image}
                onChange={(e) => updateSlide(slide.id, e.target.value)}
                onBlur={() => save("Slide image saved.")}
                placeholder="Image URL"
                className={inputCls}
              />
              <button
                onClick={() => {
                  if (content.hero.slides.length <= 2) {
                    onToast("A hero needs at least 2 slides.", "error");
                    return;
                  }
                  removeSlide(slide.id);
                }}
                disabled={content.hero.slides.length <= 2}
                title={content.hero.slides.length <= 2 ? "Minimum 2 slides required" : "Remove slide"}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-org-sm border border-org-border text-org-text-secondary hover:text-org-danger hover:border-org-danger disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <input
            value={newSlideUrl}
            onChange={(e) => setNewSlideUrl(e.target.value)}
            placeholder="New slide image URL"
            className={inputCls}
          />
          <button
            onClick={() => {
              if (!newSlideUrl.trim()) return;
              addSlide(newSlideUrl.trim());
              setNewSlideUrl("");
              save("Slide added.");
            }}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-org-sm bg-org-primary text-white text-org-sm font-org-semibold whitespace-nowrap"
          >
            <Plus size={14} /> Add Slide
          </button>
        </div>
      </div>

      {/* ── Product card style ── */}
      <div className={cardCls}>
        <p className={sectionTitleCls}>Product Card Style</p>
        <label className={labelCls}>Border Radius — {radiusPx}px</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={48}
            step={2}
            value={radiusPx}
            onChange={(e) => updateTheme("radiusCard", `${e.target.value}px`)}
            onMouseUp={() => save("Card radius saved.")}
            onTouchEnd={() => save("Card radius saved.")}
            className="flex-1"
          />
          <div
            className="w-14 h-14 shrink-0 border-2 border-org-border"
            style={{ borderRadius: `${radiusPx}px`, background: theme.primaryLight }}
          />
        </div>
      </div>

      {/* ── About section ── */}
      <div className={cardCls}>
        <p className={sectionTitleCls}>About Section</p>
        <div className="mb-3">
          <label className={labelCls}>Title</label>
          <input
            value={content.about.title}
            onChange={(e) => setAbout({ title: e.target.value })}
            onBlur={() => save("About title saved.")}
            placeholder={`About ${theme.shopName}`}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea
            value={content.about.description}
            onChange={(e) => setAbout({ description: e.target.value })}
            onBlur={() => save("About description saved.")}
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </div>
      </div>

      {/* ── How it works ── */}
      <div className={cardCls}>
        <p className={sectionTitleCls}>&ldquo;How Your Order Gets To You&rdquo; Section</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className={labelCls}>Title</label>
            <input value={content.howItWorks.title} onChange={(e) => setHowItWorks({ title: e.target.value })} onBlur={() => save("Section title saved.")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Subtitle</label>
            <input value={content.howItWorks.subtitle} onChange={(e) => setHowItWorks({ subtitle: e.target.value })} onBlur={() => save("Subtitle saved.")} className={inputCls} />
          </div>
        </div>
        <div className="space-y-3">
          {content.howItWorks.steps.map((step, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-org-sm bg-org-bg border border-org-border">
              <div>
                <label className={labelCls}>Step {i + 1} Title</label>
                <input value={step.title} onChange={(e) => updateStep(i, { title: e.target.value })} onBlur={() => save(`Step ${i + 1} saved.`)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Step {i + 1} Description</label>
                <input value={step.desc} onChange={(e) => updateStep(i, { desc: e.target.value })} onBlur={() => save(`Step ${i + 1} saved.`)} className={inputCls} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className={cardCls}>
        <p className={sectionTitleCls}>Testimonials ({content.testimonials.length})</p>
        <div className="space-y-4">
          {content.testimonials.map((t) => (
            <div key={t.id} className="p-3.5 rounded-org-sm bg-org-bg border border-org-border space-y-2.5">
              <div className="flex items-start gap-2.5">
                <textarea
                  value={t.quote}
                  onChange={(e) => updateTestimonial(t.id, { quote: e.target.value })}
                  onBlur={() => save("Testimonial saved.")}
                  placeholder="Quote"
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
                <button
                  onClick={() => removeTestimonial(t.id)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-org-sm border border-org-border text-org-text-secondary hover:text-org-danger hover:border-org-danger transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <input value={t.name} onChange={(e) => updateTestimonial(t.id, { name: e.target.value })} onBlur={() => save("Testimonial saved.")} placeholder="Name" className={inputCls} />
                <input value={t.role} onChange={(e) => updateTestimonial(t.id, { role: e.target.value })} onBlur={() => save("Testimonial saved.")} placeholder="Role / Location" className={inputCls} />
                <input value={t.avatar} onChange={(e) => updateTestimonial(t.id, { avatar: e.target.value })} onBlur={() => save("Testimonial saved.")} placeholder="Avatar image URL (optional)" className={inputCls} />
                <div className="flex items-center gap-1.5">
                  <span className="text-org-xs text-org-text-secondary shrink-0">Radius</span>
                  <input
                    type="number"
                    min={0}
                    max={48}
                    value={t.borderRadius}
                    onChange={(e) => updateTestimonial(t.id, { borderRadius: Number(e.target.value) })}
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-org-xs text-org-text-secondary">Card colour</span>
                  <input
                    type="color"
                    value={t.bg || theme.surface}
                    onChange={(e) => updateTestimonial(t.id, { bg: e.target.value })}
                    onBlur={() => save("Testimonial saved.")}
                    className="w-9 h-8 border-none rounded-lg cursor-pointer p-0.5"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-org-xs text-org-text-secondary">Text colour</span>
                  <input
                    type="color"
                    value={t.textColor || theme.text}
                    onChange={(e) => updateTestimonial(t.id, { textColor: e.target.value })}
                    onBlur={() => save("Testimonial saved.")}
                    className="w-9 h-8 border-none rounded-lg cursor-pointer p-0.5"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => { addTestimonial(); save("Testimonial added — fill in the details."); }}
          className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-org-sm bg-org-primary text-white text-org-sm font-org-semibold"
        >
          <Plus size={14} /> Add Testimonial
        </button>
      </div>

      {/* ── Contact ── */}
      <div className={cardCls}>
        <p className={sectionTitleCls}>Get In Touch Section</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Phone Number (calls &amp; SMS)</label>
            <input value={content.contact.phone} onChange={(e) => setContact({ phone: e.target.value })} onBlur={() => save("Phone number saved.")} placeholder="+254 700 000 000" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>WhatsApp Number</label>
            <input value={content.contact.whatsapp} onChange={(e) => setContact({ whatsapp: e.target.value })} onBlur={() => save("WhatsApp number saved.")} placeholder="+254 700 000 000" className={inputCls} />
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className={cardCls}>
        <p className={sectionTitleCls}>Footer</p>

        <div className="flex flex-wrap items-center gap-6 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-org-sm font-org-medium text-org-text-primary">Background colour</span>
            <input
              type="color"
              value={content.footer.bg || theme.primary}
              onChange={(e) => setFooterColors({ bg: clampToDeepShade(e.target.value) })}
              onBlur={() => save("Footer colour saved.")}
              className="w-10 h-8 border-none rounded-lg cursor-pointer p-0.5"
            />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-org-sm font-org-medium text-org-text-primary">Text colour</span>
            <input
              type="color"
              value={content.footer.text || "#ffffff"}
              onChange={(e) => setFooterColors({ text: e.target.value })}
              onBlur={() => save("Footer colour saved.")}
              className="w-10 h-8 border-none rounded-lg cursor-pointer p-0.5"
            />
          </div>
        </div>
        <p className="text-org-xs text-org-text-secondary mb-4 -mt-2">
          Background colours are automatically kept deep/muted so footer text stays legible.
        </p>

        <label className={labelCls}>Social Links ({content.footer.socials.length}) — optional</label>
        <div className="space-y-2 mb-3">
          {content.footer.socials.map((s) => (
            <div key={s.id} className="flex items-center gap-2.5">
              <input value={s.label} onChange={(e) => updateSocial(s.id, { label: e.target.value })} onBlur={() => save("Social link saved.")} placeholder="Label (e.g. Instagram)" className={inputCls} />
              <input value={s.url} onChange={(e) => updateSocial(s.id, { url: e.target.value })} onBlur={() => save("Social link saved.")} placeholder="https://..." className={inputCls} />
              <button
                onClick={() => removeSocial(s.id)}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-org-sm border border-org-border text-org-text-secondary hover:text-org-danger hover:border-org-danger transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <input value={newSocialLabel} onChange={(e) => setNewSocialLabel(e.target.value)} placeholder="Label (e.g. Instagram)" className={inputCls} />
          <input value={newSocialUrl} onChange={(e) => setNewSocialUrl(e.target.value)} placeholder="https://..." className={inputCls} />
          <button
            onClick={() => {
              if (!newSocialLabel.trim() || !newSocialUrl.trim()) return;
              addSocial(newSocialLabel.trim(), newSocialUrl.trim());
              setNewSocialLabel("");
              setNewSocialUrl("");
              save("Social link added.");
            }}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-org-sm bg-org-primary text-white text-org-sm font-org-semibold whitespace-nowrap"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* ── Reset confirmation ── */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/50" onClick={() => setShowResetConfirm(false)}>
          <div className="bg-org-surface rounded-org-card shadow-lg max-w-md w-full text-center p-8" onClick={(e) => e.stopPropagation()}>
            <p className="font-org-bold text-org-md text-org-text-primary mb-2">Reset page content?</p>
            <p className="text-org-sm text-org-text-secondary mb-6 leading-relaxed">
              This restores the hero, about, how-it-works, testimonials, contact, and footer content to their defaults.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowResetConfirm(false)} className="px-5 py-2.5 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-secondary hover:bg-org-surface-alt transition-colors">Cancel</button>
              <button
                onClick={() => { resetContent(); setShowResetConfirm(false); onToast("Page content reset to default.", "info"); }}
                className="px-5 py-2.5 rounded-org-sm bg-org-danger hover:opacity-90 text-white text-org-sm font-org-semibold transition-colors"
              >
                Yes, reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
