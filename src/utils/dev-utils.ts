import { inspect } from 'util'

export async function consoleDev(...values: unknown[]) {
  console.log(...values.map(x => inspect(x, false, null, true)))
}