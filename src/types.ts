export type Id = string
export interface IdObject {
  id: Id
}

export interface Menu extends IdObject {
  menuName: string
}

export interface Category extends IdObject {
  category: string
}

export interface Product extends IdObject {
  title: string
  image: string
  description: string
  price: number
  hidden: boolean
  // Kami: fix DProduct response to match schema
}

export interface CategoryMenu extends IdObject {
  menuId: string
  categoryId: string
}

export interface CategoryProduct extends IdObject {
  productId: string
  categoryId: string
}