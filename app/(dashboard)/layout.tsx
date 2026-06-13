import { redirect } from "next/navigation";
import MobileSidebarProvider from "@/components/dashboard/MobileSidebarProvider";
import { getAccessToken, getRefreshToken } from "@/lib/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (!accessToken && !refreshToken) {
    redirect("/auth/admin");
  }

  return <MobileSidebarProvider>{children}</MobileSidebarProvider>;
}
