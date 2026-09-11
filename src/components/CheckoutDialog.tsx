import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCartStore } from "../store/cartStore";
import { apiRequest } from "../lib/api";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CheckoutDialog({
  open,
  onOpenChange,
}: CheckoutDialogProps) {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [amountPaid, setAmountPaid] = useState("");
  const [change, setChange] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  async function handleCheckout() {
    const paid = Number(amountPaid);

    if (!amountPaid || paid < total) {
      setError("Amount paid is insufficient.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/sales", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
          amount_paid: paid,
        }),
      });

      setChange(Number(data.change_amount));
      clearCart();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Checkout failed."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setAmountPaid("");
    setChange(null);
    setError("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₱{total.toFixed(2)}</span>
          </div>

          {change === null ? (
            <>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Amount paid"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
              />

              {error && (
                <p className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <Button
                className="w-full bg-[#D9501E] hover:bg-[#F28322]"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Processing..." : "Complete Sale"}
              </Button>
            </>
          ) : (
            <div className="text-center space-y-3">
              <p className="text-lg">
                Payment successful!
              </p>

              <p className="text-2xl font-bold text-[#D9501E]">
                Change: ₱{change.toFixed(2)}
              </p>

              <Button
                className="w-full"
                onClick={handleClose}
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CheckoutDialog;