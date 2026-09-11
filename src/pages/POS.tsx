import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import ProductGrid from "../components/ProductGrid";
import Cart from "../components/Cart";
import CheckoutDialog from "../components/CheckoutDialog";
import { apiRequest } from "../lib/api";

function POS() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", search, category],
    queryFn: () =>
      apiRequest(
        `/products?search=${encodeURIComponent(
          search
        )}&category=${encodeURIComponent(category)}`
      ),
  });

  const categories = ["Food", "Drinks", "Snacks"];

  const sortedProducts = [...products].sort(
    (a: any, b: any) => {
      if (sort === "name-asc") {
        return a.name.localeCompare(b.name);
      }

      if (sort === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      if (sort === "price-low") {
        return Number(a.price) - Number(b.price);
      }

      if (sort === "price-high") {
        return Number(b.price) - Number(a.price);
      }

      return 0;
    }
  );

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  function toggleDarkMode() {
    const nextMode = !darkMode;

    setDarkMode(nextMode);
    document.documentElement.classList.toggle(
      "dark",
      nextMode
    );
  }

  return (
    <div className="min-h-screen bg-[#F2EDD5] dark:bg-gray-950 p-4 transition-colors">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mb-8">
          <div>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[#D9501E]">
              POS System
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-muted-foreground mt-1">
              Point of Sale
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/sales">
              <Button variant="outline">
                Sales History
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={toggleDarkMode}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </Button>

            <Button
              variant="outline"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </header>

        {/* Main POS */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Products */}
          <div className="lg:col-span-2 space-y-4">

            {/* Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                className="flex-1"
                placeholder="Search products..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">
                  Sort
                </option>
                <option value="name-asc">
                  Name: A-Z
                </option>
                <option value="name-desc">
                  Name: Z-A
                </option>
                <option value="price-low">
                  Price: Low to High
                </option>
                <option value="price-high">
                  Price: High to Low
                </option>
              </select>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={
                  category === ""
                    ? "default"
                    : "outline"
                }
                onClick={() => setCategory("")}
              >
                All
              </Button>

              {categories.map((item) => (
                <Button
                  key={item}
                  variant={
                    category === item
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setCategory(item)
                  }
                >
                  {item}
                </Button>
              ))}
            </div>

            {/* Products */}
            {isLoading && (
              <p className="text-muted-foreground">
                Loading products...
              </p>
            )}

            {error && (
              <p className="text-red-600">
                {error instanceof Error
                  ? error.message
                  : "Failed to load products."}
              </p>
            )}

            {!isLoading && !error && (
              <ProductGrid
                products={sortedProducts}
              />
            )}
          </div>

          {/* Cart */}
          <Cart
            onCheckout={() =>
              setCheckoutOpen(true)
            }
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