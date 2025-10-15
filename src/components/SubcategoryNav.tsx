import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { categories, type Category } from "@/data/shopData";

interface SubcategoryNavProps {
  selectedCategory: string;
  selectedSubcategory: string;
  onSubcategoryChange: (subcategory: string) => void;
}

export const SubcategoryNav = ({
  selectedCategory,
  selectedSubcategory,
  onSubcategoryChange,
}: SubcategoryNavProps) => {
  if (selectedCategory === "all") return null;

  const category = categories.find((cat) => cat.id === selectedCategory);
  if (!category) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground">Categories</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-4">
          <Button
            variant={selectedSubcategory === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onSubcategoryChange("all")}
          >
            All
          </Button>
          {category.subcategories.map((subcat) => (
            <Button
              key={subcat.id}
              variant={selectedSubcategory === subcat.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onSubcategoryChange(subcat.id)}
              className="flex items-center gap-2"
            >
              {subcat.name}
              <Badge variant="outline" className="ml-1">
                {subcat.productCount}
              </Badge>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
