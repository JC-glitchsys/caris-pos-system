import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  ReceiptText,
  Moon,
  Sun,
  LogOut,
  Search,
  SlidersHorizontal,
  Tag,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gradient-to-b from-[#FAF6E9] to-[#F2EDD5] dark:from-gray-950 dark:to-gray-900 p-4 transition-colors">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mb-8 pb-6 border-b border-[#D9501E]/10">
          <div>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[#D9501E] drop-shadow-sm">
              POS System
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-muted-foreground mt-1">
              Point of Sale
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/sales">
              <Button variant="outline" className="gap-2 shadow-sm">
                <ReceiptText className="h-4 w-4" />
                Sales History
              </Button>
            </Link>

            <Button
              variant="outline"
              className="gap-2 shadow-sm"
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </Button>

            <Button
              variant="outline"
              className="gap-2 shadow-sm"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Main POS */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Products */}
          <div className="lg:col-span-2 space-y-4">

            {/* Search + Sort + Categories */}
            <Card className="border-[#D9501E]/15 shadow-lg shadow-black/5 dark:shadow-black/30">
              <CardContent className="pt-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Search products..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                    />
                  </div>

                  <div className="relative">
                    <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <select
                      value={sort}
                      onChange={(e) =>
                        setSort(e.target.value)
                      }
                      className="h-10 w-full sm:w-auto rounded-md border border-input bg-background pl-9 pr-3 text-sm"
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
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-[#D9501E]/60 mr-1" />

                  <Button
                    size="sm"
                    className={
                      category === ""
                        ? "rounded-full bg-[#D9501E] hover:bg-[#b5400f]"
                        : "rounded-full"
                    }
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
                      size="sm"
                      className={
                        category === item
                          ? "rounded-full bg-[#D9501E] hover:bg-[#b5400f]"
                          : "rounded-full"
                      }
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
              </CardContent>
            </Card>

            {/* Products */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-[#D9501E]" />
                Loading products...
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 px-4 py-3 text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error instanceof Error
                  ? error.message
                  : "Failed to load products."}
              </div>
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
