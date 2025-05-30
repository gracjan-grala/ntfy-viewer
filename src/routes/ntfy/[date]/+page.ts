import type { PageLoad } from './$types';
import { getMealOptionsForDay } from '$lib/mealDbAdapter';
import { offsetDays, toISOJustDate } from '$lib/utils';

export const load: PageLoad = async ({ fetch, params }) => {
  const dateString = params.date;
  const prevDayDate = offsetDays(dateString, -1);
  const nextDayDate = offsetDays(dateString, 1);

  let dishData;

  try {
    dishData = await getMealOptionsForDay(dateString, fetch);
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
