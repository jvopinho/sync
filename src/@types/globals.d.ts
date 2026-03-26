export { }

declare global {
  type SuperOmit<O extends object, K extends keyof O> = Omit<O, K>
  type Optional<O extends object, K extends keyof O> = Omit<O, K> & Partial<Pick<O, K>>

  type JSONObject
    = | string
        | number
        | boolean
        | null
        | { [x: string]: JSONObject }
        | JSONObject[]

  type Enum<Keys> = [Keys, ...Keys[]]
}