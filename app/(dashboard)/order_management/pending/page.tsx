import OrderTimelinePage from "@/components/dashboard/OrderTimelinePage";

export default function PendingOrdersPage() {
  return <OrderTimelinePage timelineField="createdAt" statusKey="new" />;
}
