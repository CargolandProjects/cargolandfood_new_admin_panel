import CreatePromotion from "@/components/vendor/promotion/CreatePromoPageContent";

export default async function CreatePromoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CreatePromotion vendorId={id} />;
}
