import { CategoryMenu, Id } from '../../types'
import { generateId } from '../../utils'
import { insert } from '../db'
import { Table } from './tables'

export async function linkCategoryToMenu(menuId: Id, categoryId: Id): Promise<void> {
  const categoryMenu: CategoryMenu = {
    id: generateId(),
    menuId,
    categoryId,
  }
  await insert<CategoryMenu>(Table.CategoryMenu, categoryMenu)
}