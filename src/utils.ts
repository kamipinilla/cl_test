export type Obj = Record<string, any>

export function getAttrCount(object: Object): number {
  let count = 0
  for (const _ in object) {
    count++
  }
  return count
}