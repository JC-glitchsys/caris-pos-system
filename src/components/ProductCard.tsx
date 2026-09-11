import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useCartStore } from "../store/cartStore";
import type { CartItem } from "../store/cartStore";

interface ProductCardProps {
  product: Omit<CartItem, "quantity">;
}

function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(
    (state) => state.addItem
  );

  const outOfStock =
    product.stock_quantity === 0;

  const lowStock =
    product.stock_quantity > 0 &&
    product.stock_quantity <= 10;

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold">
            {product.name}
          </h3>

          <p className="text-sm text-muted-foreground">
            {product.category}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-[#D9501E]">
            ₱{Number(product.price).toFixed(2)}
          </span>

          <Badge
            variant={
              outOfStock
                ? "destructive"
                : lowStock
                ? "outline"
                : "secondary"
            }
          >
            {outOfStock
              ? "Out of Stock"
              : lowStock
              ? `Low Stock: ${product.stock_quantity}`
              : `${product.stock_quantity} left`}
          </Badge>
        </div>

        <Button
          className="w-full"
          disabled={outOfStock}
          onClick={() =>
            addItem({
              ...product,
              quantity: 1,
            })
          }
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}

export default ProductCard;