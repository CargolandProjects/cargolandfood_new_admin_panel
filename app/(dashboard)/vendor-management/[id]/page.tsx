import VendorDetailPage from "@/components/vendor/VendorDetailPage";

export default async function VendorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <VendorDetailPage vendorId={id} />;
}
