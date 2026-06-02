"use client";
import Link from "next/link";
import { useState } from "react";
import { IconHeart, IconHeartFilled, IconShoppingCart, IconStar } from "@tabler/icons-react";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [addedToCart, setAddedToCart] = useState(false);
  const addToCart = useCartStore((s) => s.addItem);
  const { toggle: toggleWishlist, has: inWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const isWishlisted = inWishlist(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/products/${product.id}`);
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all"
    >
      {/* Image */}
      <div className="relative">
        <div className="aspect-square bg-gray-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Discount / status badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              -{discount}%
            </span>
          )}
          {product.isNew && !discount && (
            <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              NEW
            </span>
          )}
          {product.isFlashDeal && !discount && !product.isNew && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              DEAL
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center hover:scale-110 transition-transform"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? (
            <IconHeartFilled size={14} className="text-red-500" />
          ) : (
            <IconHeart size={14} className="text-gray-400" />
          )}
        </button>

        {/* Out of stock overlay */}
        {product.status === "out_of_stock" && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[11px] text-gray-400 mb-0.5 font-medium">{product.brand}</p>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-[1.35rem] min-h-[2.7rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex gap-px">
            {[1, 2, 3, 4, 5].map((s) => (
              <IconStar
                key={s}
                size={11}
                className={
                  s <= Math.round(product.rating)
                    ? "fill-orange-400 text-orange-400"
                    : "fill-gray-200 text-gray-200"
                }
              />
            ))}
          </div>
          <span className="text-[11px] text-gray-400">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-base font-bold text-gray-900">
            KES {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              KES {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to cart */}
        {product.status !== "out_of_stock" && (
          <button
            onClick={handleAddToCart}
            className={`mt-2.5 w-full py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              addedToCart
                ? "bg-green-600 text-white"
                : "bg-green-50 text-green-700 hover:bg-green-600 hover:text-white"
            }`}
          >
            <IconShoppingCart size={15} />
            {addedToCart ? "Added to Cart!" : "Add to Cart"}
          </button>
        )}
      </div>
    </Link>
  );
}
