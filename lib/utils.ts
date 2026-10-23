export { cn } from "cn";
import { format, isValid, parse } from "date-fns";

export function formatDate(date: Date | string) {
  if (!date) return null;
  return `${format(date, "dd/MM/yyyy")}`;
}

export function formatDate2(date: Date | string) {
  if (!date) return null;
  return `${format(date, "y-M-dd")}`;
}

export function formatDate3(date: Date | string, wComma: boolean = true) {
  if (!date) return null;
  return `${format(date, `do LLL${wComma ? "," : ""} y`)}`;
}

export function formatTime(date: Date | string) {
  if (!date) return null;
  return `${format(date, "h:mm")}`;
}

export function formatTime2(time: string) {
  if (!time) return null;

  // parse the time string against a "today" anchor Date
  const parsed = parse(time.trim(), "HH:mm", new Date());
  console.log("parsed", parsed, isValid(parsed));
  if (!isValid(parsed)) return null;

  return `${format(parsed, "h:mm a")}`;
}

export function formatTime3(date: Date | string) {
  return `${format(date, "h:mm a")}`;
}

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
