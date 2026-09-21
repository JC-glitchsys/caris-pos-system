import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Wallet,
  Banknote,
  Coins,
  ReceiptText,
  Loader2,
  AlertCircle,
  PackageOpen,
  CheckCircle2,
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

import { Badge } from "@/components/ui/badge";

import { apiRequest } from "../lib/api";

function SalesHistory() {
  const {
    data: sales = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sales"],
    queryFn: () => apiRequest("/sales"),
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2EDD5] to-[#ece5c8] dark:from-gray-950 dark:to-gray-900 p-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#D9501E] to-[#b5400f] shadow-lg shadow-[#D9501E]/30">
              <ReceiptText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D9501E] to-[#b5400f] bg-clip-text text-transparent">
                Sales History
              </h1>
              <p className="text-muted-foreground">
                View completed transactions
              </p>
            </div>
          </div>

          <Link to="/pos">
            <Button variant="outline" className="gap-2 shadow-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to POS
            </Button>
          </Link>
        </div>

        <Card className="border-[#D9501E]/15 shadow-xl shadow-black/5 dark:shadow-black/30">
          <CardHeader className="border-b border-[#D9501E]/10 bg-gradient-to-r from-[#D9501E]/5 to-transparent rounded-t-xl">
            <CardTitle className="flex items-center gap-2">
              <ReceiptText className="h-5 w-5 text-[#D9501E]" />
              Completed Sales
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-4">
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-[#D9501E]" />
                Loading sales...
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 px-4 py-3 text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error instanceof Error
                  ? error.message
                  : "Failed to load sales."}
              </div>
            )}

            {!isLoading &&
              !error &&
              sales.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-14 text-center text-muted-foreground">
                  <PackageOpen className="h-10 w-10 text-[#D9501E]/40" />
                  No sales recorded yet.
                </div>
              )}

            {!isLoading &&
              !error &&
              sales.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-[#D9501E]/10">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#D9501E]/5 hover:bg-[#D9501E]/5">
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Receipt</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {sales.map((sale: any) => (
                        <TableRow
                          key={sale.id}
                          className="transition-colors hover:bg-[#D9501E]/5"
                        >
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            #{sale.id}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3.5 w-3.5 text-[#D9501E]/60" />
                              {new Date(
                                sale.created_at
                              ).toLocaleString()}
                            </div>
                          </TableCell>

                          <TableCell className="font-semibold text-[#D9501E]">
                            <div className="flex items-center gap-1.5">
                              <Wallet className="h-3.5 w-3.5" />
                              ₱
                              {Number(
                                sale.total_amount
                              ).toFixed(2)}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-1.5 text-sm">
                              <Banknote className="h-3.5 w-3.5 text-muted-foreground" />
                              ₱
                              {Number(
                                sale.amount_paid
                              ).toFixed(2)}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-1.5 text-sm">
                              <Coins className="h-3.5 w-3.5 text-muted-foreground" />
                              ₱
                              {Number(
                                sale.change_amount
                              ).toFixed(2)}
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge className="gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" />
                              Completed
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <Link
                              to={`/sales/${sale.id}`}
                            >
                              <Button
                                size="sm"
                                className="gap-1.5 bg-[#D9501E] hover:bg-[#b5400f] shadow-sm shadow-[#D9501E]/30"
                              >
                                <ReceiptText className="h-3.5 w-3.5" />
                                Receipt
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SalesHistory;
