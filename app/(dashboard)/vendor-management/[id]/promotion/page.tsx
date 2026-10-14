import VendorPromoManagement from "@/components/vendor/promotion/VendorPromoMangement";

export default async function VendorPromoManagementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <VendorPromoManagement vendorId={id} />;
}
