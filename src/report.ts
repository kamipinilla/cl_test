import { Category, Id, Product } from './types'
import { getCategoriesForMenu, getMenu, getMenuId } from './db/tables/menu'
import { getProductsForCategory } from './db/tables/category'

export interface MenuReport {
  menuID: Id
  menuName: string
  categories: CategoryReport[]
}

interface CategoryReport {
  categoryName: string
  products: ProductReport[]
}

interface ProductReport {
  id: Id
  category: string
  
  title: string
  image: string
  description: string
  price: number
}

export async function getMenuReport(): Promise<MenuReport> {
  const menuId = getMenuId()
  const menu = await getMenu(menuId)
  const categoriesReport = await getCategoriesReport(menuId)

  return {
    menuID: menuId,
    menuName: menu.menuName,
    categories: categoriesReport,
  }
}

async function getCategoriesReport(menuId: Id): Promise<CategoryReport[]> {
  const categoriesForMenu = await getCategoriesForMenu(menuId)
  const categoriesReport = await Promise.all(categoriesForMenu.map(async category => await getCategoryReport(category)))
  return categoriesReport
}

async function getCategoryReport(category: Category): Promise<CategoryReport> {
  const productsReport = await getProductsReport(category.id)

  return {
    categoryName: category.name,
    products: productsReport,
  }
}

async function getProductsReport(categoryId: Id): Promise<ProductReport[]> {
  const productsForCategory = await getProductsForCategory(categoryId)
  const notHiddenProducts = productsForCategory.filter(product => !product.hidden)
  const productsReport = await Promise.all(notHiddenProducts.map(async product => await getProductReport(product, categoryId)))
  return productsReport
}

async function getProductReport(product: Product, categoryId: Id): Promise<ProductReport> {
  const { id, title, image, description, price } = product
  return {
    id,
    category: categoryId,

    title,
    image,
    description,
    price,
  }
}