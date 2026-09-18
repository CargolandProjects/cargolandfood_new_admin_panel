"use client";

import { useVendorStat } from "@/lib/hooks/queries/useStats";
import { useSession } from "@/lib/providers/SessionProvider";

export default function VendorManagementPage() {
  const {data} = useVendorStat();
  const session = useSession();

  console.log("Session:", session?.email);

  return (
    <div className="">
      <h1 className="text-black">This is the Vendor Management Page</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3"></div>
    </div>
  );
}
