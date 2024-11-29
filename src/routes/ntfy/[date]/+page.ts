// TODO (sticky) anchor links to each meal header
// TODO use some advanced table component that allows for showing & hiding columns (carbs etc)
// TODO loading state
// TODO filters by percentile protein, rating, etc.
import type { PageLoad } from './$types';

const IMG_CDN_URL = 'https://dccore.ntfy.pl/upload/multimedia';
const MY_VARIANT = 17;
const MEAL_NAMES = {
  0: 'Śniadanie',
  1: 'Drugie śniadanie',
  2: 'Obiad',
  3: 'Podwieczorek',
  4: 'Kolacja',
};

type ValueAndColor = {
  color: number;
  value: number;
}

type MealOption = {
  id: number;
  link: string;
  name: string;
  rating: ValueAndColor;
  imgRealLink: string;
  imgSquareLink: string;
  carbs: ValueAndColor;
  fat: ValueAndColor;
  fiber: ValueAndColor;
  kcal: ValueAndColor;
  protein: ValueAndColor;
  salt: ValueAndColor;
  saturatedFat: ValueAndColor;
  position: number;
  variant: number; // the diet plan that the meal belongs to?
};

const MAX_HUE = 115;
const MIN_HUE = 27;

function calculateHSL(value: number, min: number, max: number) {
  const shift = value - min;
  const percent = shift / (max - min);
  const hue = percent * (MAX_HUE - MIN_HUE) + MIN_HUE;

  return `hsl(${hue}, 60%, 70%, .95)`;
}

function colorAttributes(meals: Array<MealOption>) {
  const singularValues: {
    rating: Array<number>,
    protein: Array<number>,
    saturatedFat: Array<number>,
  } = ['rating', 'protein',  'saturatedFat'].reduce(
    function(acc, attribute) {
      acc[attribute] = meals.map((meal) => meal[attribute].value);
      return acc;
    },
    {},
  );

  return meals.map(function colorMealOptions(meal) {
    return {
      ...meal,
      rating: {
        value: meal.rating.value,
        color: calculateHSL(meal.rating.value, Math.min(...singularValues.rating), Math.max(...singularValues.rating)),
      },
      protein: {
        value: meal.protein.value,
        color: calculateHSL(meal.protein.value, Math.min(...singularValues.protein), Math.max(...singularValues.protein)),
      },
      saturatedFat: {
        value: meal.saturatedFat.value,
        color: calculateHSL(-1 * meal.saturatedFat.value, -1 * Math.max(...singularValues.saturatedFat), -1 * Math.min(...singularValues.saturatedFat)),
      },
    };
  });
}

function ntfySort(left: MealOption, right: MealOption) {
  if (left.variant === MY_VARIANT) {
    return -1;
  }
  if (right.variant === MY_VARIANT) {
    return 1;
  }

  return left.position - right.position;
}

function processMeals(meals) {
  const normalizedMeals: { [index: number]: MealOption[] } = meals.reduce(
    function reduceMealOption(acc: { [index: number]: Array<MealOption> }, meal): { [index: number]: Array<MealOption> } {
      acc[meal.mealType].push({
        id: meal.serving.id,
        link: meal.serving.shareLink,
        name: meal.serving.meal.name,
        rating: { value: meal.serving.meal.rate },
        imgRealLink: `${IMG_CDN_URL}/${meal.serving.images.CLIENT_MULTIMEDIA.name}`,
        imgSquareLink: `${IMG_CDN_URL}/${meal.serving.images.MULTIMEDIA_SQUARE.name}`,
        carbs: { value: meal.serving.nutritionalValue[4].value },
        fat: { value: meal.serving.nutritionalValue[2].value },
        fiber: { value: meal.serving.nutritionalValue[6].value },
        kcal: { value: meal.serving.nutritionalValue[0].value },
        protein: { value: meal.serving.nutritionalValue[7].value },
        salt: { value: meal.serving.nutritionalValue[8].value },
        saturatedFat: { value: meal.serving.nutritionalValue[3].value },
        position: meal.position,
        variant: meal.variant,
      } as MealOption);
      return acc;
    },
    { 1: [], 2: [], 3: [], 4: [], 5: []},
  );

  const seenMealIds = new Set();

  return Object.fromEntries(
    Object.entries(normalizedMeals).map(
      ([index, meals]) => [
        index,
        colorAttributes(
          meals
            .sort(ntfySort)
            .filter((meal: Meal) => {
              const notSeenYet = !seenMealIds.has(meal.id);
              seenMealIds.add(meal.id);
              return notSeenYet;
            })
        )
      ]
    )
  );
};

function toISOJustDate(date: Date) {
  const dateString = date.toISOString();
  return dateString.substring(0, dateString.indexOf('T'));
}

export const load: PageLoad = async ({ fetch, params }) => {
  const AUTH_TOKEN = '';
  const URL = 'https://dccore.ntfy.pl/v3/menu?sizes=%5B31%2C34%2C39%2C42%2C46%5D&withServingIngredients=true';

  const dateString = params.date;
  const prevDayDate = new Date(dateString);
  const nextDayDate = new Date(dateString);
  prevDayDate.setDate(prevDayDate.getDate() - 1);
  nextDayDate.setDate(nextDayDate.getDate() + 1);

  let dishData;

  try {
    const response = await fetch(`${URL}&date=${dateString}`, {
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    const jsonResponse = await response.json();
    dishData = processMeals(jsonResponse.meals);
  } catch (error) {
    console.error('load function error:', error);
  }

	return {
    date: dateString,
    dishData,
    mealNames: MEAL_NAMES,
    nextDayLink: `/ntfy/${toISOJustDate(nextDayDate)}`,
    prevDayLink: `/ntfy/${toISOJustDate(prevDayDate)}`,
	};
};
