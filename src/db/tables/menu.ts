import { Category, CategoryMenu, Id, Menu } from '../../types'
import { Table } from './types'
import { getAll, get } from '../db'

export function getMenuId(): Id {
  return '3de2e09e-ff44-4c14-8918-562f68f8afb7'
}

export async function getMenu(menuId: Id): Promise<Menu> {
  const menu = await get<Menu>(Table.Menu, menuId)
  return menu
}

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