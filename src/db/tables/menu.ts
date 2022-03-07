import { Category, CategoryMenu, Id, Menu } from '../../types'
import { Table } from './types'
import { get, getMany } from '../db'

export function getMenuId(): Id {
  return '3de2e09e-ff44-4c14-8918-562f68f8afb7'
}

export async function getMenu(menuId: Id): Promise<Menu> {
  const menu = await get<Menu>(Table.Menu, menuId)
  return menu
}

export async function getCategoriesForMenu(menuId: Id): Promise<Category[]> {
  const categoriesProducts = await getMany<CategoryMenu>(Table.CategoryMenu, { menuId })
  const categoriesIdsForMenuSet = new Set<Id>(categoriesProducts.map(categoryMenu => categoryMenu.categoryId))
  
  const categoriesForMenu = (await getAll<Category>(Table.Category))
    .filter(category => categoriesIdsForMenuSet.has(category.id))
  return categoriesForMenu
}