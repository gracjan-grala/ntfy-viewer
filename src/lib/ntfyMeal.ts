import { calculateHSL, colorDescription } from '$lib/utils';
import { assignScores } from '$lib/score';

const IMG_CDN_URL = 'https://dccore.ntfy.pl/upload/multimedia';
const MY_VARIANT = 17;
export const MEAL_NAMES = {
  0: 'Śniadanie',
  1: 'Drugie śniadanie',
  2: 'Obiad',
  3: 'Podwieczorek',
  4: 'Kolacja',
};

export type ValueAndColor = {
  color?: number;
  value: number;
}

export type ApiMeal = {
  mealType: number;
  serving: {
    id: number;
    shareLink: string;
    meal: {
      name: string;
      rate: number;
    };
    nutritionalValue: {
      name: string;
      value: number;
    }[];
    nutritionalValue100g: {
      name: string;
      value: number;
    }[];
    images: {
      CLIENT_MULTIMEDIA: { name: string };
      MULTIMEDIA_SQUARE: { name: string };
    };
  };
  position: number;
  variant: number; // the diet plan that the meal belongs to?
}

export type MealOption = {
  id: number;
  link: string;
  name: string;
  coloredDescription: string;
  rating: ValueAndColor;
  imgRealLink: string;
  imgSquareLink: string;
  carbs: ValueAndColor;
  fat: ValueAndColor;
  fiber: ValueAndColor;
  generalScore?: ValueAndColor,
  kcal: ValueAndColor;
  per100g: {
    fat: number;
    fiber: number;
    saturatedFat: number;
  },
  protein: ValueAndColor;
  salt: ValueAndColor;
  saturatedFat: ValueAndColor;
  simpleSugars: ValueAndColor;
  position: number;
  variant: number;
};

export function mealOptionFromObject(mealObj: ApiMeal): MealOption {
  return {
    id: mealObj.serving.id,
    link: mealObj.serving.shareLink,
    name: mealObj.serving.meal.name,
    coloredDescription: colorDescription(mealObj.serving.meal.name),
    rating: { value: mealObj.serving.meal.rate },
    imgRealLink: `${IMG_CDN_URL}/${mealObj.serving.images.CLIENT_MULTIMEDIA.name}`,
    imgSquareLink: `${IMG_CDN_URL}/${mealObj.serving.images.MULTIMEDIA_SQUARE.name}`,
    carbs: { value: mealObj.serving.nutritionalValue[4].value },
    fat: { value: mealObj.serving.nutritionalValue[2].value },
    fiber: { value: mealObj.serving.nutritionalValue[6].value },
    kcal: { value: mealObj.serving.nutritionalValue[0].value },
    per100g: {
      fat: mealObj.serving.nutritionalValue100g[2].value,
      fiber: mealObj.serving.nutritionalValue100g[6].value,
      saturatedFat: mealObj.serving.nutritionalValue100g[3].value,
    },
    protein: { value: mealObj.serving.nutritionalValue[7].value },
    salt: { value: mealObj.serving.nutritionalValue[8].value },
    saturatedFat: { value: mealObj.serving.nutritionalValue[3].value },
    simpleSugars: { value: mealObj.serving.nutritionalValue[5].value },
    position: mealObj.position,
    variant: mealObj.variant,
  };
}

export function parseMeals(meals: ApiMeal[]): { [index: number]: MealOption[] } {
  return meals.reduce(
    function reduceMealOption(acc: { [index: number]: MealOption[] }, meal): { [index: number]: MealOption[] } {
      acc[meal.mealType].push(mealOptionFromObject(meal));
      return acc;
    },
    { 1: [], 2: [], 3: [], 4: [], 5: []},
  );
}

export function colorAttributes(meals: MealOption[]) {
  const singularValues: {
    generalScore: number[],
    rating: number[],
    protein: number[],
    saturatedFat: number[],
  } = ['generalScore', 'rating', 'protein',  'saturatedFat'].reduce(
    function(acc, attribute) {
      acc[attribute] = meals.map((meal) => meal[attribute].value);
      return acc;
    },
    {},
  );

  return meals.map(function colorMealOptions(meal) {
    return {
      ...meal,
      generalScore: {
        value: meal.generalScore.value,
        color: calculateHSL(meal.generalScore.value, Math.min(...singularValues.generalScore), Math.max(...singularValues.generalScore)),
      },
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

export function deduplicate(mealOptions: MealOption[]): MealOption[] {
  const seenMealIds = new Set();

  return mealOptions.filter((meal: MealOption) => {
    const notSeenYet = !seenMealIds.has(meal.id);
    seenMealIds.add(meal.id);
    return notSeenYet;
  })
}

export function ntfySort(left: MealOption, right: MealOption): number {
  if (left.variant === MY_VARIANT) {
    return -1;
  }
  if (right.variant === MY_VARIANT) {
    return 1;
  }

  return left.position - right.position;
}

export function processMeals(normalizedMeals: { [index: number]: MealOption[] }) {
  return Object.fromEntries(
    Object.entries(normalizedMeals).map(
      ([index, meals]) => [index,
        colorAttributes(
          assignScores(
            deduplicate(
              meals
            )
          ).sort(ntfySort)
        ),
      ]
    )
  );
}
