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
import { apiRequest } from "../lib/api";

function SalesHistory() {
  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: () => apiRequest("/sales"),
  });

  return (
    <div className="min-h-screen bg-[#F2EDD5] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#D9501E]">
            Sales History
          </h1>

          <Link to="/pos">
            <Button>Back to POS</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Completed Sales</CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <p>Loading sales...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {sales.map((sale: any) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.id}</TableCell>
                      <TableCell>
                        {new Date(
                          sale.created_at
                        ).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ₱{Number(sale.total_amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        ₱{Number(sale.amount_paid).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        ₱{Number(sale.change_amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Link to={`/sales/${sale.id}`}>
                          <Button size="sm">View</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SalesHistory;