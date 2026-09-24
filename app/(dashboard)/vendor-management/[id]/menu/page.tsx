import VendorMenuPageContent from "@/components/vendor/menu/VendorMenuPageContent";

export default async function VendorMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VendorMenuPageContent vendorId={id} />;
}
