import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { offsetDays, toISOJustDate } from '$lib/utils';

export const load: PageLoad = async () => {
  redirect(307, `/ntfy/${toISOJustDate(offsetDays(new Date(), 4))}`);
};
