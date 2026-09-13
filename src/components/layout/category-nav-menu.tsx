import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { CATEGORIES } from "@/lib/constants/categories";

/** Desktop-only "Categories" dropdown listing all product categories. */
export function CategoryNavMenu() {
  return (
    <NavigationMenu className="max-w-none flex-none justify-start">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-sm font-medium text-foreground-secondary hover:text-foreground data-open:text-foreground">
            Categories
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[520px] grid-cols-2 gap-1 p-2">
              {CATEGORIES.map(({ slug, name, icon: Icon }) => (
                <li key={slug}>
                  <NavigationMenuLink asChild>
                    <Link href={`/products?category=${slug}`}>
                      <Icon className="size-4 text-brand" strokeWidth={1.5} />
                      {name}
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
