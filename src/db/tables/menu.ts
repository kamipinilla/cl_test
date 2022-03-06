import { Category, CategoryMenu, Id } from '../../types'
import { Table } from './types'
import { getAll } from '../db'

export async function getCategoriesForMenu(menuId: Id): Promise<Category[]> {
  const categoriesIdsForMenuSet = new Set<Id>(
    (await getAll<CategoryMenu>(Table.CategoryMenu))
      .filter(categoryMenu => categoryMenu.menuId === menuId)
      .map(categoryMenu => categoryMenu.categoryId)
  )
  
  const categoriesForMenu = (await getAll<Category>(Table.Category))
    .filter(category => categoriesIdsForMenuSet.has(category.id))
  return categoriesForMenu
}