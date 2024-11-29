import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async () => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 4);

  let dateString = targetDate.toISOString();
  dateString = dateString.substring(0, dateString.indexOf('T'));

  redirect(307, `/ntfy/${dateString}`);
};
