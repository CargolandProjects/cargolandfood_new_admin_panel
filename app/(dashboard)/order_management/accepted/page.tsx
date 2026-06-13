import OrderTimelinePage from "@/components/dashboard/OrderTimelinePage";

export default function AcceptedOrdersPage() {
  return <OrderTimelinePage timelineField="acceptedAt" statusKey="accepted" />;
}
