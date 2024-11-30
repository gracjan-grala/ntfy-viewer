const MAX_HUE = 115;
const MIN_HUE = 27;

export function toISOJustDate(date: Date): string {
  const dateString = date.toISOString();
  return dateString.substring(0, dateString.indexOf('T'));
}

export function offsetDays(input: Date | string, days: number): Date {
  const date = new Date(input);
  date.setDate(date.getDate() + days);
  return date;
}

export function calculateHSL(value: number, min: number, max: number) {
  const shift = value - min;
  const percent = shift / (max - min);
  const hue = percent * (MAX_HUE - MIN_HUE) + MIN_HUE;

  return `hsl(${hue}, 60%, 70%, .95)`;
}
