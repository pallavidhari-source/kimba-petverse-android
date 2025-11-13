import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore, useProductCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    items, 
    isLoading, 
    updateQuantity, 
    removeItem, 
    createCheckout 
  } = useCartStore();
  const productCart = useProductCartStore();
  
  const shopifyTotalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const productTotalItems = productCart.getTotalItems();
  const totalItems = shopifyTotalItems + productTotalItems;
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0) + productCart.getTotalPrice();

  const handleCheckout = async () => {
    try {
      await createCheckout();
      const checkoutUrl = useCartStore.getState().checkoutUrl;
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
        setIsOpen(false);
        toast.success("Redirecting to checkout...");
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error("Failed to create checkout. Please try again.");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Your cart is empty" : `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 && productCart.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            </div>
          ) : (
            <>
              {/* Shopify Items */}
              {items.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Shop Items ({shopifyTotalItems})</h3>
                  <div className="space-y-3 overflow-y-auto max-h-[40vh]">
                    {items.map((item) => (
                      <div key={item.variantId} className="flex gap-4 p-3 rounded-lg border bg-card">
                        <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                          {item.product.node.images?.edges?.[0]?.node && (
                            <img
                              src={item.product.node.images.edges[0].node.url}
                              alt={item.product.node.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.product.node.title}</h4>
                          {item.selectedOptions.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              {item.selectedOptions.map(option => option.value).join(' • ')}
                            </p>
                          )}
                          <p className="font-semibold mt-1">
                            {item.price.currencyCode} ${parseFloat(item.price.amount).toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => removeItem(item.variantId)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                          
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ethnic Wear Items */}
              {productCart.items.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Ethnic Wear ({productTotalItems})</h3>
                  <div className="space-y-3 overflow-y-auto max-h-[40vh]">
                    {productCart.items.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-4 p-3 rounded-lg border bg-card">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                          <p className="font-semibold mt-1">${item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => productCart.removeItem(item.id, item.size)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                          
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => productCart.updateQuantity(item.id, item.size, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => productCart.updateQuantity(item.id, item.size, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Checkout Section */}
              <div className="flex-shrink-0 space-y-3 pt-4 border-t mt-auto">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
                </div>
                
                {items.length > 0 && (
                  <Button 
                    onClick={handleCheckout}
                    className="w-full" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Checkout...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Checkout Shopify Items
                      </>
                    )}
                  </Button>
                )}
                
                {productCart.items.length > 0 && (
                  <Button 
                    onClick={() => toast.info("Ethnic wear checkout coming soon!")}
                    className="w-full" 
                    size="lg"
                    variant="secondary"
                  >
                    Checkout Ethnic Wear
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};