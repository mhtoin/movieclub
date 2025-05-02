export type ItemCoordinates = {
  tier: number
  index: number
}

export type DraggableItem = {
  id: string
  index: ItemCoordinates
}

export interface DrawResponse {
  ok: boolean
  data: {
    label: string
    data: Array<{ user: string; movies: number }>
  }
}

export interface UserChartData {
  label: string
  data: Array<{ user: string; movies: number }>
}

export interface RangeSelection {
  min: string
  max: string
}

export type DiscordUser = {
  id: string
  username: string
  avatar: string
  avatar_decoration: string
  discriminator: string
  public_flags: number
  verified?: boolean
  email?: string
  flags: number
  banner: string
  banner_color: string
  accent_color: number
}
