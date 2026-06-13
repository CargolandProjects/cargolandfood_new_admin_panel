import OrderTimelinePage from "@/components/dashboard/OrderTimelinePage";

export default function ArrivedOrdersPage() {
  return <OrderTimelinePage timelineField="riderOutsideAt" statusKey="arrived" />;
}
