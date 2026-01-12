import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  trend: string;
  color: string;
  footerLabel: string; // Add this new prop
}

export default function StatCard({
  title,
  value,
  subtext,
  trend,
  color,
  footerLabel, // Destructure it here
}: StatCardProps) {
  return (
    /* OUTER GREY CARD: #F7F7F7 */
    <div className="bg-[#F7F7F7] rounded-[24px] border border-gray-100 overflow-hidden shadow-sm flex flex-col">
      {/* INNER WHITE CARD */}
      <div className="bg-white p-6 rounded-b-[24px]">
        <h4 className="text-[16px] text-[#6E6E6E] font-medium leading-tight">
          {title}
        </h4>
        <div className="flex items-baseline gap-2 mt-4 mb-2">
          <span className="text-[32px] font-bold text-[#1A1A1A] leading-none">
            {value}
          </span>
          <span className="text-[14px] text-[#666666]">{subtext}</span>
        </div>
      </div>

      {/* FOOTER SECTION */}
      <div className="px-6 py-4 flex justify-between items-center mt-auto">
        <span className="text-[14px] text-[#666666] font-medium">
          {footerLabel} {/* Changed from "Total Size" to dynamic prop */}
        </span>
        <div
          className={`flex items-center gap-1 text-[14px] font-bold ${color}`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>{trend}</span>
        </div>
      </div>
    </div>
  );
}
