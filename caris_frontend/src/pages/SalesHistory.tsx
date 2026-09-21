import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Wallet,
  Banknote,
  Coins,
  ReceiptText,
  Loader2,
  AlertCircle,
  Hash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { apiRequest } from "../lib/api";

function SaleDetails() {
  const { id } = useParams();

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sale", id],
    queryFn: () => apiRequest(`/sales/${id}`),
  });

  const sale = data?.sale;
  const items = data?.items ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2EDD5] to-[#ece5c8] dark:from-gray-950 dark:to-gray-900 p-4 transition-colors">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#D9501E] to-[#b5400f] shadow-lg shadow-[#D9501E]/30">
              <ReceiptText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D9501E] to-[#b5400f] bg-clip-text text-transparent">
                Receipt
              </h1>
              <p className="text-muted-foreground">
                Transaction details
              </p>
            </div>
          </div>

          <Link to="/sales">
            <Button variant="outline" className="gap-2 shadow-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Sales History
            </Button>
          </Link>
        </div>

        <Card className="border-[#D9501E]/15 shadow-xl shadow-black/5 dark:shadow-black/30">
          <CardHeader className="border-b border-[#D9501E]/10 bg-gradient-to-r from-[#D9501E]/5 to-transparent rounded-t-xl">
            <CardTitle className="flex items-center gap-2">
              <ReceiptText className="h-5 w-5 text-[#D9501E]" />
              {sale ? `Sale #${sale.id}` : "Sale Details"}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-4">
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-[#D9501E]" />
                Loading receipt...
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 px-4 py-3 text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error instanceof Error
                  ? error.message
                  : "Failed to load this sale."}
              </div>
            )}

            {!isLoading && !error && sale && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Hash className="h-3.5 w-3.5 text-[#D9501E]/60" />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Sale ID
                      </div>
                      <div className="font-medium">#{sale.id}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-[#D9501E]/60" />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Date
                      </div>
                      <div className="font-medium">
                        {new Date(sale.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Banknote className="h-3.5 w-3.5 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Paid
                      </div>
                      <div className="font-medium">
                        ₱{Number(sale.amount_paid).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Coins className="h-3.5 w-3.5 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Change
                      </div>
                      <div className="font-medium">
                        ₱{Number(sale.change_amount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-[#D9501E]/10">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#D9501E]/5 hover:bg-[#D9501E]/5">
                        <TableHead>Product</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            ₱{Number(item.unit_price).toFixed(2)}
                          </TableCell>
                          <TableCell className="font-medium">
                            ₱{Number(item.subtotal).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end">
                  <div className="w-full sm:w-64 space-y-1 rounded-lg bg-[#D9501E]/5 p-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Amount Paid</span>
                      <span>₱{Number(sale.amount_paid).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Change</span>
                      <span>₱{Number(sale.change_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#D9501E]/15 font-bold text-[#D9501E]">
                      <span className="flex items-center gap-1.5">
                        <Wallet className="h-4 w-4" />
                        Total
                      </span>
                      <span>₱{Number(sale.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SaleDetails;
