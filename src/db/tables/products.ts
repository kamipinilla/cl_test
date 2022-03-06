import { Product } from '../../types'
import { getAll, insert } from '../db'
import { Table } from './types'

export async function getAllProducts(): Promise<Product[]> {
  const products = await getAll<Product>(Table.Product)
  return products
}

export async function createProduct(product: Product): Promise<void> {
  await insert<Product>(Table.Product, product)
}