import { createCategory, getAllCategories } from './db/tables/category'
import { linkCategoryToMenu } from './db/tables/categoryMenu'
import { getCategoriesForMenu } from './db/tables/menu'
import { ExternalProduct, getExternalProducts } from './externalProducts'
import { Category, CategoryMenu, Id, Product } from './types'

async function main() {
  const externalProducts = await getExternalProducts()
  await createCategories(externalProducts)
  await linkCategoriesToMenu(externalProducts)
  // await processProducts(externalProducts)
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

// async function processProducts(externalProducts: ExternalProduct[]): Promise<void> {
//   const allProducts = await getAllProducts()
//   const productsToCreate = getProductsToCreate(allProducts, externalProducts)
//   await createProducts(productsToCreate)
//   const createdProductsIds = productsToCreate.map(product => product.id)
//   await linkCategoriesAndProducts(createdProductsIds, externalProducts)

//   const productsToUpdate = getProductsToUpdate(allProducts, externalProducts)
//   await updateProducts(productsToUpdate)
// }