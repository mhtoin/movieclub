declare global {
  namespace PrismaJson {
    type GenresType = Array<{ id: number; name: string }>
    type WatchProvidersType = {
      providers: Array<Provider>
      link: string
    }

    type ConfigProviders = Array<Provider>

    type Provider = {
      logo_path: string
      provider_name: string
      provider_id: number
      display_priority: number
    }

    type Images = {
      backdrops: SingleImage[]
      posters: SingleImage[]
      logos: SingleImage[]
    }

    type SingleImage = {
      aspect_ratio: number
      file_path: string
      height: number
      width: number
      iso_639_1?: string
      vote_average: number
      vote_count: number
      blurDataUrl?: string
    }

    type Videos = Array<{
      iso_639_1: string
      iso_3166_1: string
      name: string
      key: string
      site: string
      size: number
      type: string
      official: boolean
      published_at: string
      id: string
    }>

    type CrewMembers = Array<{
      adult: boolean
      gender: number
      id: number
      known_for_department: string
      name: string
      original_name: string
      popularity: number
      profile_path?: string
      credit_id: string
      department: string
      job: string
    }>

    type CastMember = {
      adult: boolean
      gender: number
      id: number
      known_for_department: string
      name: string
      original_name: string
      popularity: number
      profile_path?: string
      cast_id: number
      character: string
      credit_id: string
      order: number
    }

    type CastMembers = Array<CastMember>
    type WatchdateFilter = {
      from: string
      to: string
    }
  }
}

export type GenresType = Array<{ id: number; name: string }>
export type WatchProvidersType = {
  providers: Array<Provider>
  link: string
}

export type ConfigProviders = Array<Provider>

export type Provider = {
  logo_path: string
  provider_name: string
  provider_id: number
  display_priority: number
}

export type Images = {
  backdrops: SingleImage[]
  posters: SingleImage[]
  logos: SingleImage[]
}

export type SingleImage = {
  aspect_ratio: number
  file_path: string
  height: number
  width: number
  iso_639_1: string | undefined
  vote_average: number
  vote_count: number
  blurDataUrl?: string
}

export type Videos = Array<{
  iso_639_1: string
  iso_3166_1: string
  name: string
  key: string
  site: string
  size: number
  type: string
  official: boolean
  published_at: string
  id: string
}>

export type CrewMembers = Array<{
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path?: string
  credit_id: string
  department: string
  job: string
}>

export type CastMembers = Array<{
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path?: string
  cast_id: number
  character: string
  credit_id: string
  order: number
}>

export type WatchdateFilter = {
  from: string
  to: string
}
