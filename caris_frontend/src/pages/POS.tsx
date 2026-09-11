import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductGrid from "../components/ProductGrid";
import Cart from "../components/Cart";
import CheckoutDialog from "../components/CheckoutDialog";
import { apiRequest } from "../lib/api";

function POS() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", search, category],
    queryFn: () =>
      apiRequest(
        `/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`
      ),
  });

  const categories = ["Food", "Drinks", "Snacks"];

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-[#F2EDD5] p-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#D9501E]">
              POS System
            </h1>

            <p className="text-muted-foreground">
              Point of Sale
            </p>
          </div>

          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Button
                variant={category === "" ? "default" : "outline"}
                onClick={() => setCategory("")}
              >
                All
              </Button>

              {categories.map((item) => (
                <Button
                  key={item}
                  variant={
                    category === item ? "default" : "outline"
                  }
                  onClick={() => setCategory(item)}
                >
                  {item}
                </Button>
              ))}
            </div>

            {isLoading && (
              <p>Loading products...</p>
            )}

            {error && (
              <p className="text-red-600">
                {error instanceof Error
                  ? error.message
                  : "Failed to load products."}
              </p>
            )}

            {!isLoading && !error && (
              <ProductGrid products={products} />
            )}
          </div>

          <Cart
            onCheckout={() => setCheckoutOpen(true)}
          />
        </div>
      </div>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
      />
    </div>
  );
}

export default POS;