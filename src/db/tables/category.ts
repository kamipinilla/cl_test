import { Id, Product, Category, CategoryProduct } from '../../types'
import { query, insert, getWhereIdIn, getAll } from '../db'
import { Table } from './tables'

export async function getProductsForCategory(categoryId: Id): Promise<Product[]> {
  const categoriesProducts = await query<CategoryProduct>(Table.CategoryProduct, { categoryId })
  const productsIdsForMenu = categoriesProducts.map(categoryProduct => categoryProduct.productId)
  const productsForCategory = (await getWhereIdIn<Product>(Table.Product, productsIdsForMenu))
  return productsForCategory
}

export async function getAllCategories(): Promise<Category[]> {
  const categories = await getAll<Category>(Table.Category)
  return categories
}

export async function createCategory(category: Category): Promise<void> {
  await insert<Category>(Table.Category, category)
}