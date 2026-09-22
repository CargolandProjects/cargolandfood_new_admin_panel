export { cn } from "cn";

export const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const formatNumber = (value: string) => {
  if (!value) return "";
  const number = value.replace(/\D/g, ""); // remove non-digits
  return new Intl.NumberFormat("en-US").format(Number(number));
};
