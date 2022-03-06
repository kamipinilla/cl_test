import { Category } from '../../types'
import { getAll, insert } from '../db'
import { Table } from './types'

export async function getAllCategories(): Promise<Category[]> {
  const categories = await getAll<Category>(Table.Category)
  return categories
}

export async function createCategory(category: Category): Promise<void> {
  await insert<Category>(Table.Category, category)
}