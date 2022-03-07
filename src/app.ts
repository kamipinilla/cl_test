import { createCategory, getAllCategories } from './db/tables/category'
import { linkCategoryToMenu } from './db/tables/categoryMenu'
import { linkProductAndCategory } from './db/tables/categoryProduct'
import { getCategoriesForMenu, getMenuId } from './db/tables/menu'
import { createProduct, getAllProducts, updateProduct } from './db/tables/product'
import { ExternalProduct, getExternalProducts } from './externalProducts'
import { getMenuReport, MenuReport } from './report'
import { Category, Id, Product } from './types'

export default async function app(): Promise<MenuReport> {
  const externalProducts = await getExternalProducts()
  await createCategories(externalProducts)
  await linkCategoriesToMenu(externalProducts)
  await processProducts(externalProducts)
  const menuReport = await getMenuReport()
  return menuReport
}

async function createCategories(externalProducts: ExternalProduct[]): Promise<void> {
  const allCategories = await getAllCategories()
  const allCategoriesIdsSet = new Set<Id>(allCategories.map(category => category.id))

  const externalCategories = externalProducts.map(externalProduct => externalProduct.getCategory())
  const categoriesToCreate = externalCategories.filter(externalCategory => !allCategoriesIdsSet.has(externalCategory))
  const categoriesToCreateUnique = new Set<string>(categoriesToCreate)

  const createCategories: Promise<void>[] = []
  for (const categoryString of categoriesToCreateUnique) {
    const category: Category = {
      id: categoryString,
      name: categoryString,
    }
    createCategories.push(createCategory(category))
  }
  await Promise.all(createCategories)
}

async function linkCategoriesToMenu(externalProducts: ExternalProduct[]): Promise<void> {
  const menuId = getMenuId()
  const categoriesForMenu = await getCategoriesForMenu(menuId)
  const categoriesIdsForMenuSet = new Set<Id>(categoriesForMenu.map(category => category.id))

  const externalCategories = externalProducts.map(externalProduct => externalProduct.getCategory())
  const categoriesToLink = externalCategories.filter(externalCategory => !categoriesIdsForMenuSet.has(externalCategory))
  const categoriesToLinkUnique = new Set<string>(categoriesToLink)

  const linkCategoriesToMenu: Promise<void>[] = []
  for (const categoryString of categoriesToLinkUnique) {
    const categoryId = categoryString
    linkCategoriesToMenu.push(linkCategoryToMenu(menuId, categoryId))
  }
  await Promise.all(linkCategoriesToMenu)
}

async function linkProductsToCategories(productsIds: Id[], externalProducts: ExternalProduct[]): Promise<void>  {
  const productsIdsSet = new Set<Id>(productsIds)
  const externalProductsToLink = externalProducts.filter(externalProduct => productsIdsSet.has(externalProduct.getId()))

  const linkProductsToCategories: Promise<void>[] = []
  for (const externalProductToLink of externalProductsToLink) {
    const productId = externalProductToLink.getId()
    const categoryId = externalProductToLink.getCategory()
    linkProductsToCategories.push(linkProductAndCategory(productId, categoryId))
  }
  await Promise.all(linkProductsToCategories)
}

async function processProducts(externalProducts: ExternalProduct[]): Promise<void> {
  const allProducts = await getAllProducts()
  const productsToCreate = getProductsToCreate(allProducts, externalProducts)
  await createProducts(productsToCreate)
  const createdProductsIds = productsToCreate.map(product => product.id)
  await linkProductsToCategories(createdProductsIds, externalProducts)
  await updateProducts(allProducts, externalProducts)
}

async function updateProducts(allProducts: Product[], externalProducts: ExternalProduct[]): Promise<void> {
  await updateIntersectionProducts(allProducts, externalProducts)
  await updateDifferenceProducts(allProducts, externalProducts)
}

async function updateIntersectionProducts(allProducts: Product[], externalProducts: ExternalProduct[]): Promise<void> {
  const allProductsIdsSet = new Set<string>(allProducts.map(product => product.id))
  const intersectionExternalProducts = externalProducts.filter(externalProduct => allProductsIdsSet.has(externalProduct.getId()))
  
  const intersectionProductUpdates: Promise<void>[] = []
  for (const externalProduct of intersectionExternalProducts) {
    const productId = externalProduct.getId()
    const productUpdate = externalProduct.getProduct()

    intersectionProductUpdates.push(updateProduct(productId, productUpdate))
  }
  await Promise.all(intersectionProductUpdates)
}

async function updateDifferenceProducts(allProducts: Product[], externalProducts: ExternalProduct[]): Promise<void> {
  const externalProductsIdsSet = new Set<Id>(externalProducts.map(externalProduct => externalProduct.getId()))

  const differenceProductsIds = allProducts
    .map(product => product.id)
    .filter(productId => !externalProductsIdsSet.has(productId))
  
  const differenceProductUpdates: Promise<void>[] = []
  const productUpdate: Partial<Product> = {
    hidden: true,
  }
  for (const productId of differenceProductsIds) {
    differenceProductUpdates.push(updateProduct(productId, productUpdate))
  }
  await Promise.all(differenceProductUpdates)
}

function getProductsToCreate(allProducts: Product[], externalProducts: ExternalProduct[]): Product[] {
  const allProductsIdsSet = new Set<Id>(allProducts.map(product => product.id))

  const productsToCreate = externalProducts
    .filter(externalProduct => !allProductsIdsSet.has(externalProduct.getId()))
    .map(externalProduct => externalProduct.getProduct())

  return productsToCreate
}

async function createProducts(products: Product[]): Promise<void> {
  const createProducts: Promise<void>[] = []
  for (const product of products) {
    createProducts.push(createProduct(product))
  }
  await Promise.all(createProducts)
}