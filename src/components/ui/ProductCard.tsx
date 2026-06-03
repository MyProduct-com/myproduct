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
      className="group block bg-white rounded-[12px] border border-[0.5px] border-[#E5E7EB] overflow-hidden hover:border-[#D4F0E2] transition-colors"
    >
      {/* Image */}
      <div className="relative">
        <div className="aspect-square bg-[#F3F4F6] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount && (
            <span className="bg-[#E8500A] text-white text-[11px] font-[500] px-[10px] py-[3px] rounded-full">
              -{discount}%
            </span>
          )}
          {product.isNew && !discount && (
            <span className="bg-[#D4F0E2] text-[#1A6B3C] text-[11px] font-[500] px-[10px] py-[3px] rounded-full">
              NEW
            </span>
          )}
          {product.isFlashDeal && !discount && !product.isNew && (
            <span className="bg-[#FFF0E8] text-[#B84000] text-[11px] font-[500] px-[10px] py-[3px] rounded-full">
              DEAL
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full border border-[#E5E7EB] flex items-center justify-center hover:border-[#D4F0E2] transition-colors"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? (
            <IconHeartFilled size={13} className="text-[#E8500A]" />
          ) : (
            <IconHeart size={13} className="text-[#9CA3AF]" />
          )}
        </button>

        {/* Out of stock */}
        {product.status === "out_of_stock" && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
            <span className="text-[11px] font-[500] text-[#6B7280] bg-white px-[10px] py-[3px] rounded-full border border-[#E5E7EB]">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[11px] font-[500] text-[#6B7280] mb-0.5">{product.brand}</p>
        <h3 className="text-[13px] font-[500] text-[#111827] line-clamp-2 leading-[1.4] min-h-[36px]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex gap-px">
            {[1, 2, 3, 4, 5].map((s) => (
              <IconStar
                key={s}
                size={10}
                className={
                  s <= Math.round(product.rating)
                    ? "fill-[#E8500A] text-[#E8500A]"
                    : "fill-[#E5E7EB] text-[#E5E7EB]"
                }
              />
            ))}
          </div>
          <span className="text-[11px] text-[#9CA3AF]">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="font-mono text-[13px] font-[600] text-[#25A55A]">
            KES {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-[#E8500A] line-through">
              KES {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to cart */}
        {product.status !== "out_of_stock" && (
          <button
            onClick={handleAddToCart}
            className={`mt-2.5 w-full py-[9px] rounded-[8px] text-[13px] font-[500] transition-all flex items-center justify-center gap-1.5 ${
              addedToCart
                ? "bg-[#D4F0E2] text-[#1A6B3C]"
                : "bg-[#F3F4F6] text-[#111827] hover:bg-[#25A55A] hover:text-white"
            }`}
          >
            <IconShoppingCart size={14} />
            {addedToCart ? "Added!" : "Add to Cart"}
          </button>
        )}
      </div>
    </Link>
  );
}
