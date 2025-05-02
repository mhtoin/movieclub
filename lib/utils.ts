import { isServer } from '@tanstack/react-query'
import { type ClassValue, clsx } from 'clsx'
import { type Day, format, nextDay } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj }
  for (const key of keys) {
    delete result[key]
  }
  return result
}

/**
 * Shuffles an array using the Fisher-Yates algorithm
 * @param array Array to shuffle
 * @returns A new shuffled array (original array is not modified)
 */
export const shuffle = <T>(array: T[]): T[] => {
  // Create a copy to avoid mutating the original array
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Returns a random element from an array
 * @param arr Source array
 * @param withShuffle Whether to shuffle the array before sampling
 * @returns A random element from the array, or undefined if the array is empty
 */
export const sample = <T>(arr: T[], withShuffle: boolean): T | undefined => {
  if (arr == null || arr.length === 0) return undefined

  // If withShuffle is true, use a shuffled copy, otherwise use the original array
  const sourceArr = withShuffle ? shuffle(arr) : arr
  return sourceArr[getSecureRandom(sourceArr.length)]
}

export const range = (length: number) => {
  return Array.from({ length: length }, (_, i) => i)
}

type OrderByItem = {
  user: {
    name: string
  }
  movie: unknown
}

export const orderBy = <T extends OrderByItem>(
  arr: T[],
  _key: string,
  _order: string,
) => {
  return arr.reduce((r: Record<string, unknown[]>, a) => {
    r[a.user.name] = [...(r[a?.user?.name] || []), a?.movie]
    return r
  }, {})
}

export const groupBy = <T, K extends string | number | undefined | null>(
  arr: T[],
  cb: (arg0: T) => K,
) => {
  return arr.reduce(
    (r: Record<string, T[]>, a) => {
      const key = cb(a)?.toString() ?? ''
      r[key] = [...(r[key] || []), a]
      return r
    },
    {} as Record<string, T[]>,
  )
}

export const keyBy = <T, K extends string | number>(
  arr: T[],
  cb: (arg0: T) => K,
) => {
  return arr.reduce(
    (r: Record<K, T>, a) => {
      r[cb(a)] = a
      return r
    },
    {} as Record<K, T>,
  )
}

/**
 * Sorts collection into groups and returns  collection with the count of items of each group
 * @param arr collection to sort
 * @param cb  callback function to get the key to sort by
 * @returns sorted collection
 */
export const countByKey = <T>(arr: T[], cb: (arg0: T) => string) => {
  return arr.reduce((r: Record<string, number>, a) => {
    const key = cb(a)
    r[key] = (r[key] || 0) + 1
    return r
  }, {})
}

export function getBaseURL() {
  if (!isServer) {
    return ''
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sortByISODate(a: string, b: string, direction: 'asc' | 'desc') {
  return direction === 'asc' ? a.localeCompare(b) : -a.localeCompare(b)
}

export function sendShortlistUpdate(userId: string) {
  'use client'
  publishMessage({ queryKey: ['shortlists'] }, 'shortlist', userId)
}

export async function publishMessage(
  message: string | object,
  topic: string,
  user_id: string,
) {
  await fetch(
    `${
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080'
        : process.env.NEXT_PUBLIC_RELAY_URL
    }/publish`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        topic: topic,
        user_id: user_id,
      }),
    },
  )
}

export async function sendNotification(
  message: string | object,
  user_id: string,
) {
  await fetch(
    `${
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080'
        : process.env.NEXT_PUBLIC_RELAY_URL
    }/publish`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        topic: 'shortlist',
        user_id: user_id,
      }),
    },
  )
}

export async function getBlurDataUrl(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl)
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    return `data:image/jpeg;base64,${base64}`
  } catch (error) {
    console.error('Error generating blur data URL:', error)
    return '' // Return empty string as fallback
  }
}

export function getNextMonth(month: string) {
  const dateParts = month.split('-')
  const monthNumber = Number.parseInt(dateParts[1])
  const yearNumber = Number.parseInt(dateParts[0])
  const nextMonthNumber =
    monthNumber > 1 ? monthNumber - 1 : monthNumber === 1 ? 12 : 1
  const nextYearNumber = monthNumber === 1 ? yearNumber - 1 : yearNumber
  const nextMonthString =
    nextMonthNumber < 10 ? `0${nextMonthNumber}` : nextMonthNumber
  const nextMonth = `${nextYearNumber}-${nextMonthString}`
  return nextMonth
}

const getSecureRandom = (max: number) => {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return array[0] % max
}

export function getNextDefaultWatchDate(dayOfTheWeek: string) {
  const day = dayOfTheWeek.toLowerCase()

  // map the day to the day of the week for date-fns
  const dayMap: Record<string, Day> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  }

  const dayNumber = dayMap[day]

  if (dayNumber === undefined) {
    throw new Error(`Invalid day of the week: ${dayOfTheWeek}`)
  }

  const nextDate = nextDay(new Date(), dayNumber)

  return format(nextDate, 'yyyy-MM-dd')
}
