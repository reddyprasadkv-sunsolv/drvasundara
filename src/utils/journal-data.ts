import definitions from '../data/journal-categories.json';
import { categoryId } from './journal.mjs';
export const journalCategories = definitions;
export const journalCategory = (data: {
  category: string;
  journalCategory?: string;
}) => definitions.find((c) => c.id === categoryId(data));
export const categoryPath = (id: string) => `/blog/category/${id}/`;
