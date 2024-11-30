// TODO (sticky) anchor links to each meal header
// TODO use some advanced table component that allows for showing & hiding columns (carbs etc)
// TODO filters by percentile protein, rating, etc.
import { PUBLIC_AUTH_TOKEN } from '$env/static/public';
import type { PageLoad } from './$types';
import { parseMeals, processMeals, } from '$lib/ntfyMeal';
import { offsetDays, toISOJustDate } from '$lib/utils';

export const load: PageLoad = async ({ fetch, params }) => {
  const URL = 'https://dccore.ntfy.pl/v3/menu?sizes=%5B31%2C34%2C39%2C42%2C46%5D&withServingIngredients=true';

  const dateString = params.date;
  const prevDayDate = offsetDays(dateString, -1);
  const nextDayDate = offsetDays(dateString, 1);

  let dishData;

  try {
    const response = await fetch(`${URL}&date=${dateString}`, {
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${PUBLIC_AUTH_TOKEN}`,
      },
    });
    const jsonResponse = await response.json();
    dishData = processMeals(parseMeals(jsonResponse.meals));
  } catch (error) {
    console.error('Failed to fetch meals from NTFY', error);
  }

	return {
    date: dateString,
    dishData,
    nextDayLink: `/ntfy/${toISOJustDate(nextDayDate)}`,
    prevDayLink: `/ntfy/${toISOJustDate(prevDayDate)}`,
	};
};
