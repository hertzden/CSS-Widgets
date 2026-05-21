const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

/** Format an ISO `YYYY-MM-DD` (or any string the Date constructor accepts) as "June 4, 2020". */
export function formatDate(iso: string): string {
  return formatter.format(new Date(iso));
}
