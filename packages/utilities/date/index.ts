import { UTCDateMini } from "@date-fns/utc";
import { addHours, format } from "date-fns";

export function dayNumToJapanese(day: number) {
  const days = ["日", "月", "火", "水", "木", "金", "土"] as const;
  return days[day];
}

export function dateToDayJapanese(date: Date) {
  return dayNumToJapanese(date.getDay());
}

export const toJSTDate = (date: string | Date | number) => {
  const utcDate = new UTCDateMini(date);
  const JSTDate = addHours(utcDate, 9);
  return new Date(JSTDate);
};

export function formatJST(
  date: Date | string | number,
  dateFormat = "yyyy-MM-dd",
): string {
  const dateTimeZone = format(date, "xxx");
  const isJST = dateTimeZone === "+09:00" || dateTimeZone === "+0900";
  if (isJST) {
    return format(date, dateFormat);
  }

  return format(toJSTDate(date), dateFormat);
}

export const getDateDiffInDays = (date1: Date, date2: Date) => {
  const diff = date2.getTime() - date1.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};
