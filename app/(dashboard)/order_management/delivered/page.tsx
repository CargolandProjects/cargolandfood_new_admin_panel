import OrderTimelinePage from "@/components/dashboard/OrderTimelinePage";

export default function DeliveredOrdersPage() {
  return <OrderTimelinePage timelineField="deliveredAt" statusKey="delivered" />;
}
