import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-[#F2EDD5] dark:bg-gray-950 p-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#D9501E]">
              Sales History
            </h1>

            <p className="text-muted-foreground">
              View completed transactions
            </p>
          </div>

          <Link to="/pos">
            <Button variant="outline">
              Back to POS
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Completed Sales
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading && (
              <p className="text-muted-foreground">
                Loading sales...
              </p>
            )}

            {error && (
              <p className="text-red-600">
                {error instanceof Error
                  ? error.message
                  : "Failed to load sales."}
              </p>
            )}

            {!isLoading &&
              !error &&
              sales.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No sales recorded yet.
                </p>
              )}

            {!isLoading &&
              !error &&
              sales.length > 0 && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>Receipt</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {sales.map((sale: any) => (
                        <TableRow key={sale.id}>
                          <TableCell>
                            #{sale.id}
                          </TableCell>

                          <TableCell>
                            {new Date(
                              sale.created_at
                            ).toLocaleString()}
                          </TableCell>

                          <TableCell className="font-medium">
                            ₱
                            {Number(
                              sale.total_amount
                            ).toFixed(2)}
                          </TableCell>

                          <TableCell>
                            ₱
                            {Number(
                              sale.amount_paid
                            ).toFixed(2)}
                          </TableCell>

                          <TableCell>
                            ₱
                            {Number(
                              sale.change_amount
                            ).toFixed(2)}
                          </TableCell>

                          <TableCell>
                            <Link
                              to={`/sales/${sale.id}`}
                            >
                              <Button size="sm">
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