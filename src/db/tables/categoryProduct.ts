import { CategoryProduct, Id } from '../../types'
import { generateId } from '../../utils'
import { insert } from '../db'
import { Table } from './tables'

export async function linkProductAndCategory(productId: Id, categoryId: Id): Promise<void> {
  const categoryProduct: CategoryProduct = {
    id: generateId(),
    productId,
    categoryId,
  }
  await insert<CategoryProduct>(Table.CategoryProduct, categoryProduct)
}