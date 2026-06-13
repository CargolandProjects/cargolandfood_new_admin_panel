import OrderTimelinePage from "@/components/dashboard/OrderTimelinePage";

export default function CancelledOrdersPage() {
  return <OrderTimelinePage timelineField="cancelledAt" statusKey="cancelled" />;
}
