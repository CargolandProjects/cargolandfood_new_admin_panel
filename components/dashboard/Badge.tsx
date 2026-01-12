type BadgeType = "zone" | "status" | "vehicle";

const THEMES: Record<string, { bg: string; text: string }> = {
  // Zone Themes
  "Alimosho, Lagos": { bg: "bg-[#FCE7F3]", text: "text-[#9D174D]" },
  "Ikeja, Lagos": { bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },
  "Victoria Island, Lagos": { bg: "bg-[#E0F2FE]", text: "text-[#075985]" },
  Motorcycle: { bg: "bg-[#E0F2FE]", text: "text-[#075985]" }, // Blue (Like VI)
  Bicycle: { bg: "bg-[#FCE7F3]", text: "text-[#9D174D]" }, // Pink (Like Alimosho)
  "Electric Scooter": { bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },

  // Status Themes
  Active: { bg: "bg-[#E7F7EF]", text: "text-[#0D894F]" },
  "On Probation": { bg: "bg-[#FFF4E5]", text: "text-[#B25E09]" },
  Terminated: { bg: "bg-[#F2F4F7]", text: "text-[#344054]" },

  // Default fallback
  default: { bg: "bg-gray-100", text: "text-gray-600" },
};

export function Badge({
  value,
  showDot = false,
}: {
  value: string;
  showDot?: boolean;
}) {
  const theme = THEMES[value] || THEMES["default"];

  return (
    <span
      className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 w-fit ${theme.bg} ${theme.text}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full bg-current`} />}
      {value}
    </span>
  );
}
