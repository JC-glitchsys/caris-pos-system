import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCartStore } from "../store/cartStore";
import CartItem from "./CartItem";

interface CartProps {
  onCheckout: () => void;
}

function Cart({ onCheckout }: CartProps) {
  const items = useCartStore((state) => state.items);

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Cart</CardTitle>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            Your cart is empty.
          </p>
        ) : (
          <>
            <div>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₱{total.toFixed(2)}</span>
              </div>

              <Button
                className="w-full mt-4 bg-[#D9501E] hover:bg-[#F28322]"
                onClick={onCheckout}
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default Cart;