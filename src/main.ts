import { createCategory, getAllCategories } from './db/tables/category'
import { linkCategoryToMenu } from './db/tables/categoryMenu'
import { linkProductAndCategory } from './db/tables/categoryProduct'
import { getCategoriesForMenu } from './db/tables/menu'
import { createProduct, getAllProducts } from './db/tables/products'
import { ExternalProduct, getExternalProducts } from './externalProducts'
import { Category, Id, Product } from './types'

async function main() {
  const externalProducts = await getExternalProducts()
  await createCategories(externalProducts)
  await linkCategoriesToMenu(externalProducts)
  await processProducts(externalProducts)
}

main()

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
      category: categoryString,
    }
    createCategories.push(createCategory(category))
  }
  await Promise.all(createCategories)
}

async function linkCategoriesToMenu(externalProducts: ExternalProduct[]): Promise<void> {
  const menuId = '3de2e09e-ff44-4c14-8918-562f68f8afb7'
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

  // const productsToUpdate = getProductsToUpdate(allProducts, externalProducts)
  // await updateProducts(productsToUpdate)
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