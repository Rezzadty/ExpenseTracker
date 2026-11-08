export type PeriodRange = {
  start: string; // inclusive, YYYY-MM-DD
  endExclusive: string; // exclusive, YYYY-MM-DD (first day of next period)
  key: string; // YYYY-MM of the period start month
  label: string; // e.g. "NOV 2026"
};

const MONTH_LABELS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

export function getPeriodRange(today: string, startDay = 1): PeriodRange {
  if (!Number.isInteger(startDay) || startDay < 1 || startDay > 28) {
    throw new Error("startDay must be an integer between 1 and 28");
  }

  const [year, month] = today.split("-").map(Number);
  const start = new Date(year, month - 1, startDay);
  const endExclusive = new Date(year, month, startDay);

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const startStr = fmt(start);
  const endStr = fmt(endExclusive);
  const key = `${year}-${String(month).padStart(2, "0")}`;
  const label = `${MONTH_LABELS[month - 1]} ${year}`;

  return { start: startStr, endExclusive: endStr, key, label };
}

export function shiftPeriod(range: PeriodRange, delta: number): PeriodRange {
  const [year, month] = range.key.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
  return getPeriodRange(today);
}

export function isInPeriod(dateString: string, range: PeriodRange): boolean {
  return dateString >= range.start && dateString < range.endExclusive;
}