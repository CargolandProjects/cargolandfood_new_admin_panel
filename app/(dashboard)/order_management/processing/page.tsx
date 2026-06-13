import OrderTimelinePage from "@/components/dashboard/OrderTimelinePage";

export default function PreparingOrdersPage() {
  return <OrderTimelinePage timelineField="preparedAt" statusKey="processing" />;
}
