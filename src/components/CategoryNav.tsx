import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dog, Cat, Heart, ShoppingBag } from "lucide-react";

interface CategoryNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryIcons = {
  dog: Dog,
  cat: Cat,
  healthcare: Heart,
  accessories: ShoppingBag,
};

export const CategoryNav = ({ selectedCategory, onCategoryChange }: CategoryNavProps) => {
  const categories = [
    { id: "all", name: "All Products", icon: ShoppingBag },
    { id: "dog", name: "Dog", icon: Dog },
    { id: "cat", name: "Cat", icon: Cat },
    { id: "healthcare", name: "Healthcare", icon: Heart },
    { id: "accessories", name: "Accessories", icon: ShoppingBag },
  ];

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => onCategoryChange(category.id)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {category.name}
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
