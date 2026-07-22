import {
  Store,
  ShoppingCart,
  ShoppingBag,
  Laptop,
  Smartphone,
  BookOpen,
  Shirt,
  Wrench,
  Carrot,
  Coffee,
  Utensils,
  Gift,
  Home,
  Car,
  Leaf,
  Heart,
  Music,
  Camera,
  Pill,
  Dumbbell,
  Palette,
  Scissors,
  PawPrint,
  Flower2,
  Watch,
  Gem,
  Baby,
  Sofa,
  Bike,
  type LucideIcon,
} from "lucide-react";

export const LOGO_ICON_OPTIONS: { name: string; icon: LucideIcon }[] = [
  { name: "Store", icon: Store },
  { name: "ShoppingCart", icon: ShoppingCart },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "Laptop", icon: Laptop },
  { name: "Smartphone", icon: Smartphone },
  { name: "BookOpen", icon: BookOpen },
  { name: "Shirt", icon: Shirt },
  { name: "Wrench", icon: Wrench },
  { name: "Carrot", icon: Carrot },
  { name: "Coffee", icon: Coffee },
  { name: "Utensils", icon: Utensils },
  { name: "Gift", icon: Gift },
  { name: "Home", icon: Home },
  { name: "Car", icon: Car },
  { name: "Leaf", icon: Leaf },
  { name: "Heart", icon: Heart },
  { name: "Music", icon: Music },
  { name: "Camera", icon: Camera },
  { name: "Pill", icon: Pill },
  { name: "Dumbbell", icon: Dumbbell },
  { name: "Palette", icon: Palette },
  { name: "Scissors", icon: Scissors },
  { name: "PawPrint", icon: PawPrint },
  { name: "Flower2", icon: Flower2 },
  { name: "Watch", icon: Watch },
  { name: "Gem", icon: Gem },
  { name: "Baby", icon: Baby },
  { name: "Sofa", icon: Sofa },
  { name: "Bike", icon: Bike },
];

const LOGO_ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  LOGO_ICON_OPTIONS.map(({ name, icon }) => [name, icon])
);

export const DEFAULT_LOGO_ICON_NAME = "Store";

export function getLogoIcon(name: string | undefined | null): LucideIcon {
  if (!name) return Store;
  return LOGO_ICON_MAP[name] ?? Store;
}
