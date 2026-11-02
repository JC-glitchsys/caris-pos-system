import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiRequest } from "../lib/api";

function SaleDetails() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["sale", id],
    queryFn: () => apiRequest(`/sales/${id}`),
  });

  if (isLoading) {
    return <p className="p-6">Loading sale...</p>;
  }

  if (!data) {
    return <p className="p-6">Sale not found.</p>;
  }

  return (
    <div className="min-h-screen bg-[#F2EDD5] p-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/sales">
          <Button variant="outline" className="mb-4">
            Back to Sales
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Sale #{data.sale.id}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {data.items.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">{item.name}</p>

                  <p className="text-sm text-muted-foreground">
                    {item.quantity} × ₱
                    {Number(item.unit_price).toFixed(2)}
                  </p>
                </div>

                <p className="font-semibold">
                  ₱{Number(item.subtotal).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Total</span>

                <span>
                  ₱{Number(data.sale.total_amount).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Amount Paid</span>

                <span>
                  ₱{Number(data.sale.amount_paid).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between font-bold text-[#D9501E]">
                <span>Change</span>

                <span>
                  ₱{Number(data.sale.change_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SaleDetails;