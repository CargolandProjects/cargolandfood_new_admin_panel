import OrderTimelinePage from "@/components/dashboard/OrderTimelinePage";

export default function AssignOrdersPage() {
  return <OrderTimelinePage timelineField="assignedAt" statusKey="assign" />;
}
