import { insert } from '$lib/mongodb';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, cookies }) => {
	const res = await insert('forms', { people: [] });
	return { id: res.insertedId.toString() };
}) as PageServerLoad;
