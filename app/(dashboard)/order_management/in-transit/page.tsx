import OrderTimelinePage from "@/components/dashboard/OrderTimelinePage";

export default function InTransitOrdersPage() {
  return <OrderTimelinePage timelineField="pickedupAt" statusKey="in-transit" />;
}
