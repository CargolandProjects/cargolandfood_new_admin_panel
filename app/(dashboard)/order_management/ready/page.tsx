import OrderTimelinePage from "@/components/dashboard/OrderTimelinePage";

export default function ReadyOrdersPage() {
  return <OrderTimelinePage timelineField="readyAt" statusKey="ready" />;
}
