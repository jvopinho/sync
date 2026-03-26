type Entry<O, K extends keyof O> = [K, O[K]]
type Entries<O> = Entry<O, keyof O>[]

export const extractKeys = <Obj extends object>(obj: Obj) => Object.keys(obj) as Array<keyof Obj>

export const entries = <Obj extends object>(obj: Obj) => Object.entries(obj) as Entries<Obj>

export const omit = <Obj extends object, Keys extends Array<keyof Obj>>(obj: Obj, keys: Keys) => {
  const output = {} as Obj

  for(const [key, value] of entries(obj)) {
    if(!keys.includes(key)) {
      output[key as keyof typeof output] = value
    }
  }

  return output as Omit<Obj, Keys[number]>
}