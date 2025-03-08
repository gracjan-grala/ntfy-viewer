import * as staticVars from '$env/static/public';

const MAX_HUE = 115;
const MIN_HUE = 27;

const ANY_LETTER = '[\\wąężółćśń]';
const GREENLIST_REGEX = new RegExp(`${ANY_LETTER}*(${staticVars?.PUBLIC_GREENLIST})${ANY_LETTER}*`, 'ig');
const GREENLIST_REPLACE = '<span class="greenlisted">$&</span>';
const REDLIST_REGEX = new RegExp(`${ANY_LETTER}*(${staticVars?.PUBLIC_REDLIST})${ANY_LETTER}*`, 'ig');
const REDLIST_REPLACE = '<span class="redlisted">$&</span>';

export function toISOJustDate(date: Date): string {
  const dateString = date.toISOString();
  return dateString.substring(0, dateString.indexOf('T'));
}

export function offsetDays(input: Date | string, days: number): Date {
  const date = new Date(input);
  date.setDate(date.getDate() + days);
  return date;
}

export function calculateHSL(value: number, min: number, max: number): string {
  const shift = value - min;
  const percent = shift / (max - min);
  const hue = percent * (MAX_HUE - MIN_HUE) + MIN_HUE;

  return `hsl(${hue}, 60%, 70%, .95)`;
}

export function colorDescription(description: string): string {
  return description
    .replace(REDLIST_REGEX, REDLIST_REPLACE)
    .replace(GREENLIST_REGEX, GREENLIST_REPLACE);
}
