import {
  TomatoIcon,
  CarrotIcon,
  HerbSprigIcon,
  BreadIcon,
  GroceryBagIcon,
  BowlIcon,
} from "@/components/illustrations/FoodIcons";

/** Subtle decorative food icons scattered in the page margins — purely
 *  ambient texture, hidden on narrow viewports where there's no margin to
 *  put them in. */
export function FoodScatter() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden lg:block">
      <TomatoIcon className="absolute left-[6%] top-[18%] w-16 -rotate-12 opacity-[0.16]" />
      <HerbSprigIcon className="absolute left-[10%] top-[55%] w-20 rotate-6 opacity-[0.16]" />
      <GroceryBagIcon className="absolute left-[4%] top-[82%] w-16 rotate-3 opacity-[0.16]" />

      <CarrotIcon className="absolute right-[7%] top-[22%] w-14 rotate-12 opacity-[0.16]" />
      <BreadIcon className="absolute right-[5%] top-[58%] w-20 -rotate-6 opacity-[0.16]" />
      <BowlIcon className="absolute right-[8%] top-[85%] w-16 rotate-6 opacity-[0.16]" />
    </div>
  );
}
