import { type MealOption } from './ntfyMeal';

const SCORE_WEIGHTS = [
  31, // % of energy from protein
  25, // the rating coming from NTFY users
  13, // unsaturated fats
  13, // saturated fats
  9, // complex to simple sugar ratio
  9, // dietary fiber per 100g
];

function weighScore(a: number, b: number, c: number, d: number, e: number, f: number): number {
  return (
    a * SCORE_WEIGHTS[0] +
    b * SCORE_WEIGHTS[1] +
    c * SCORE_WEIGHTS[2] +
    d * SCORE_WEIGHTS[3] +
    e * SCORE_WEIGHTS[4] +
    f * SCORE_WEIGHTS[5]
  );
}

export function calculateScore(meal: MealOption): number {
  // factor salt in?
  const energyFromProtein = meal.protein.value * 4;
  const energyFromProteinPct = 100 * energyFromProtein / meal.kcal.value;
  const complexToSimpleSugarRatio = Math.min(
    2.5 * (meal.carbs.value - meal.simpleSugars.value) / meal.simpleSugars.value,
    50, // to guard against infinity caused by 0 simple carbs
  );

  let ratingCoefficient = meal.rating.value - 3.8;
  if (meal.rating.value === 0) {
    ratingCoefficient = 0.6;
  }

  return weighScore(
    (energyFromProteinPct / 30),
    ratingCoefficient,
    (meal.per100g.fat - meal.per100g.saturatedFat) / 20,
    1 - meal.per100g.saturatedFat / 20,
    complexToSimpleSugarRatio / 50,
    meal.per100g.fiber / 6,
  );
}

export function assignScores(mealOptions: MealOption[]): MealOption[] {
  return mealOptions.map((meal: MealOption) => ({
    ...meal,
    generalScore: { value: calculateScore(meal) },
  }));
}
