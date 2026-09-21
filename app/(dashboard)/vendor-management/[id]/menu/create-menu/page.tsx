import CreateMenuPageContent from "@/components/vendor/menu/CreateMenuPageContent";

export default async function CreateMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CreateMenuPageContent vendorId={id} />;
}
