import { Button } from "@/components/ui/button";
import { useCartStore } from "../store/cartStore";
import type { CartItem as CartItemType } from "../store/cartStore";

interface Props {
  item: CartItemType;
}

function CartItem({ item }: Props) {
  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity
  );

  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity
  );

  const removeItem = useCartStore(
    (state) => state.removeItem
  );

  return (
    <div className="border-b py-3">
      <div className="flex justify-between">
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-muted-foreground">
            ₱{Number(item.price).toFixed(2)} each
          </p>
        </div>

        <p className="font-semibold">
          ₱{(Number(item.price) * item.quantity).toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => decreaseQuantity(item.id)}
        >
          -
        </Button>

        <span className="w-8 text-center">{item.quantity}</span>

        <Button
          size="sm"
          variant="outline"
          disabled={item.quantity >= item.stock_quantity}
          onClick={() => increaseQuantity(item.id)}
        >
          +
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={() => removeItem(item.id)}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

export default CartItem;