export type Id = string
export interface IdObject {
  id: Id
}

export interface Menu extends IdObject {
  menuName: string
}

export interface Category extends IdObject {
  name: string
}

export interface Product extends IdObject {
  title: string
  image: string
  description: string
  price: number
  hidden: boolean
}

export interface CategoryMenu extends IdObject {
  menuId: string
  categoryId: string
}

export interface CategoryProduct extends IdObject {
  productId: string
  categoryId: string
}