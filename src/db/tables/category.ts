import { Id, Product, Category, CategoryProduct } from '../../types'
import { getMany, insert } from '../db'
import { Table } from './types'

export async function getProductsForCategory(categoryId: Id): Promise<Product[]> {
  const categoriesProducts = await getMany<CategoryProduct>(Table.CategoryProduct, { categoryId })
  const productsIdsForMenuSet = new Set<Id>(categoriesProducts.map(categoryProduct => categoryProduct.productId))

  const productsForCategory = (await getAll<Product>(Table.Product))
    .filter(product => productsIdsForMenuSet.has(product.id))
  return productsForCategory
}

export async function getAllCategories(): Promise<Category[]> {
  const categories = await getAll<Category>(Table.Category)
  return categories
}

export async function createCategory(category: Category): Promise<void> {
  await insert<Category>(Table.Category, category)
}