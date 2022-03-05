import dotenv from 'dotenv'
dotenv.config()

export function getEnvVar(name: string): string {
  const value = process.env[name]
  if (value !== undefined) {
    return value
  } else {
    throw Error(`Env variable not found: ${name}`)
  }
}

export function getAttrCount(object: Object): number {
  let count = 0
  for (const _ in object) {
    count++
  }
  return count
}

export type Obj = Record<string, any>