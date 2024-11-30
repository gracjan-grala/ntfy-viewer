import { type LoadEvent } from '@sveltejs/kit';

import { PUBLIC_AUTH_TOKEN } from '$env/static/public';
import type { MealOption } from '$lib/ntfyMeal';
import { parseMeals, processMeals, } from '$lib/ntfyMeal';

const URL = 'https://dccore.ntfy.pl/v3/menu?sizes=%5B31%2C34%2C39%2C42%2C46%5D&withServingIngredients=true';
const DATABASE: { [date: string]: { [index: number]: MealOption[] } } = {};

export async function getMealOptionsForDay(date: string, fetch: LoadEvent['fetch']) {
  if (Object.hasOwn(DATABASE, date)) {
    return DATABASE[date];
  }

  const response = await fetch(`${URL}&date=${date}`, {
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${PUBLIC_AUTH_TOKEN}`,
    },
  });

  const jsonResponse = await response.json();
  const dishData = processMeals(parseMeals(jsonResponse.meals));

  DATABASE[date] = dishData;
  return dishData
}
