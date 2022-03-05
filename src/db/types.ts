export type Id = string
export interface DObject extends Record<string, any> {
  id: Id
}

export interface Menu extends DObject {
  menuName: string
}

export interface Category extends DObject {
  category: string
}

export interface Product extends DObject {
  title: string
  image: string
  description: string
  price: number
  hidden: boolean
  // Kami: fix DProduct response to match schema
}

export interface CategoryMenu extends DObject {
  menuId: string
  categoryId: string
}

export interface CategoryProduct extends DObject {
  productId: string
  categoryId: string
}