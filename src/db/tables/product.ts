import { Id, Product } from '../../types'
import { getAll, insert, update } from '../db'
import { Table } from './tables'

export async function getAllProducts(): Promise<Product[]> {
  const products = await getAll<Product>(Table.Product)
  return products
}

export async function createProduct(product: Product): Promise<void> {
  await insert<Product>(Table.Product, product)
}

export async function updateProduct(productId: Id, productUpdate: Partial<Product>): Promise<void> {
  if (productUpdate.id) {
    delete productUpdate.id
  }
  await update<Product>(Table.Product, productId, productUpdate)
}