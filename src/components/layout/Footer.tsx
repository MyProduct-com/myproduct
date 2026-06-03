import Link from "next/link";
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconMapPin,
  IconPhone,
  IconMail,
} from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-green-400">My</span>
              <span className="text-white">Products</span>
            </h3>
            <p className="text-sm leading-relaxed text-gray-400 mb-5">
              Kenya&apos;s growing marketplace for electronics, fashion, groceries and more. Fast delivery, secure payments, trusted sellers.
            </p>
            <div className="flex gap-2.5">
              {[IconBrandFacebook, IconBrandTwitter, IconBrandInstagram, IconBrandWhatsapp].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-colors"
                  >
                    <Icon size={17} />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {[
                ["About Us", "/about"],
                ["Careers", "/careers"],
                ["Press & Media", "/press"],
                ["Blog", "/blog"],
                ["Affiliate Program", "/affiliate"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Seller links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Sell on MyProducts
            </h4>
            <ul className="space-y-2.5">
              {[
                ["Seller Centre", "/auth/signup?role=seller"],
                ["Seller Pricing", "/pricing"],
                ["Seller Guidelines", "/guidelines"],
                ["Help Centre", "/help"],
                ["Report a Problem", "/report"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 mb-5">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <IconMapPin size={15} className="mt-0.5 text-green-400 flex-shrink-0" />
                Westlands Square, 4th Floor, Nairobi, Kenya
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <IconPhone size={15} className="text-green-400 flex-shrink-0" />
                <a href="tel:+254700000000" className="hover:text-green-400 transition-colors">
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <IconMail size={15} className="text-green-400 flex-shrink-0" />
                <a
                  href="mailto:support@myproducts.co.ke"
                  className="hover:text-green-400 transition-colors"
                >
                  support@myproducts.co.ke
                </a>
              </li>
            </ul>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-medium">
              We accept
            </p>
            <div className="flex flex-wrap gap-2">
              {["M-Pesa", "Visa", "Mastercard", "Cash on Delivery"].map((method) => (
                <span
                  key={method}
                  className="bg-gray-800 text-gray-300 text-xs px-2.5 py-1 rounded font-medium"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} MyProducts Kenya Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {[["Privacy Policy", "/privacy"], ["Terms of Use", "/terms"], ["Cookies", "/cookies"]].map(
              ([label, href]) => (
                <Link key={href} href={href} className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
                  {label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
