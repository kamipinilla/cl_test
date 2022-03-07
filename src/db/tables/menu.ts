import { Category, CategoryMenu, Id, Menu } from '../../types'
import { Table } from './tables'
import { get, getWhereIdIn, query } from '../db'

export function getMenuId(): Id {
  return '3de2e09e-ff44-4c14-8918-562f68f8afb7'
}

export async function getMenu(menuId: Id): Promise<Menu> {
  const menu = await get<Menu>(Table.Menu, menuId)
  return menu
}

export async function getCategoriesForMenu(menuId: Id): Promise<Category[]> {
  const categoriesProducts = await query<CategoryMenu>(Table.CategoryMenu, { menuId })
  const categoriesIdsForMenu = categoriesProducts.map(categoryMenu => categoryMenu.categoryId)
  const categoriesForMenu = await getWhereIdIn<Category>(Table.Category, categoriesIdsForMenu)
  return categoriesForMenu
}