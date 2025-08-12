interface RadarrMovie {
  title: string
  tmdbId: number
  year: number
  qualityProfileId: number
  rootFolderPath: string
  monitored: boolean
  addOptions: {
    monitor: string
    searchForMovie: boolean
  }
}

interface RadarrResponse {
  id: number
  title: string
  tmdbId: number
  monitored: boolean
  hasFile: boolean
  downloaded: boolean
}

interface RadarrConfig {
  baseUrl: string
  apiKey: string
  rootFolder: string
  qualityProfileId: number
  monitored: boolean
}

interface UserRadarrSettings {
  radarrUrl: string | null
  radarrApiKey: string | null
  radarrRootFolder: string | null
  radarrQualityProfileId: number | null
  radarrMonitored: boolean
  radarrEnabled: boolean
}

function getRadarrConfig(): RadarrConfig {
  return {
    baseUrl: process.env.RADARR_URL || "",
    apiKey: process.env.RADARR_API_KEY || "",
    rootFolder: process.env.RADARR_ROOT_FOLDER || "/movies",
    qualityProfileId: parseInt(process.env.RADARR_QUALITY_PROFILE_ID || "1"),
    monitored: process.env.RADARR_MONITORED === "true",
  }
}

function isRadarrConfigured(): boolean {
  const config = getRadarrConfig()
  return !!(config.baseUrl && config.apiKey)
}

function isUserRadarrConfigured(userSettings: UserRadarrSettings): boolean {
  return !!(
    userSettings.radarrEnabled &&
    userSettings.radarrUrl &&
    userSettings.radarrApiKey
  )
}

async function makeRadarrRequest(
  endpoint: string,
  config: RadarrConfig,
  method: string = "GET",
  body?: unknown,
): Promise<unknown> {
  if (!config.baseUrl || !config.apiKey) {
    throw new Error(
      "Radarr is not configured. Please set RADARR_URL and RADARR_API_KEY environment variables.",
    )
  }

  const url = `${config.baseUrl}/api/v3/${endpoint}`
  const headers = {
    "X-Api-Key": config.apiKey,
    "Content-Type": "application/json",
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Radarr API error: ${response.status} ${response.statusText} - ${errorText}`,
      )
    }

    return response.status === 204 ? null : await response.json()
  } catch (error) {
    console.error("Radarr API request failed:", error)
    throw error
  }
}

export async function addMovieToRadarr(
  tmdbId: number,
  title: string,
  releaseDate: string,
): Promise<RadarrResponse | null> {
  "use server"

  try {
    if (!isRadarrConfigured()) {
      console.warn("Radarr is not configured. Skipping movie addition.")
      return null
    }

    const config = getRadarrConfig()

    // First check if movie already exists in Radarr
    const existingMovie = await getMovieByTmdbId(tmdbId)
    if (existingMovie) {
      console.log(
        `Movie "${title}" (TMDB ID: ${tmdbId}) already exists in Radarr`,
      )
      return existingMovie
    }

    // Extract year from release date
    const year = new Date(releaseDate).getFullYear()

    const movieData: RadarrMovie = {
      title,
      tmdbId,
      year,
      qualityProfileId: config.qualityProfileId,
      rootFolderPath: config.rootFolder,
      monitored: config.monitored,
      addOptions: {
        monitor: "movieOnly", // Monitor only this movie
        searchForMovie: true, // Automatically search for the movie
      },
    }

    console.log(`Adding movie to Radarr: "${title}" (TMDB ID: ${tmdbId})`)
    const result = await makeRadarrRequest("movie", config, "POST", movieData)

    console.log(`Successfully added movie to Radarr: "${title}"`)
    return result as RadarrResponse
  } catch (error) {
    console.error(`Failed to add movie "${title}" to Radarr:`, error)
    // Don't throw the error to avoid breaking the raffle process
    return null
  }
}

export async function addMovieToUserRadarr(
  tmdbId: number,
  title: string,
  releaseDate: string,
  userSettings: UserRadarrSettings,
): Promise<RadarrResponse | null> {
  "use server"

  try {
    if (!isUserRadarrConfigured(userSettings)) {
      console.warn("User Radarr is not configured. Skipping movie addition.")
      return null
    }

    const config: RadarrConfig = {
      baseUrl: userSettings.radarrUrl!,
      apiKey: userSettings.radarrApiKey!,
      rootFolder: userSettings.radarrRootFolder || "/movies",
      qualityProfileId: userSettings.radarrQualityProfileId || 1,
      monitored: userSettings.radarrMonitored,
    }

    // First check if movie already exists in Radarr
    const existingMovie = await getUserMovieByTmdbId(tmdbId, userSettings)
    if (existingMovie) {
      console.log(
        `Movie "${title}" (TMDB ID: ${tmdbId}) already exists in user's Radarr`,
      )
      return existingMovie
    }

    // Extract year from release date
    const year = new Date(releaseDate).getFullYear()

    const movieData: RadarrMovie = {
      title,
      tmdbId,
      year,
      qualityProfileId: config.qualityProfileId,
      rootFolderPath: config.rootFolder,
      monitored: config.monitored,
      addOptions: {
        monitor: "movieOnly", // Monitor only this movie
        searchForMovie: true, // Automatically search for the movie
      },
    }

    console.log(
      `Adding movie to user's Radarr: "${title}" (TMDB ID: ${tmdbId})`,
    )
    const result = await makeRadarrRequest("movie", config, "POST", movieData)

    console.log(`Successfully added movie to user's Radarr: "${title}"`)
    return result as RadarrResponse
  } catch (error) {
    console.error(`Failed to add movie "${title}" to user's Radarr:`, error)
    // Don't throw the error to avoid breaking the raffle process
    return null
  }
}

export async function getMovieByTmdbId(
  tmdbId: number,
): Promise<RadarrResponse | null> {
  "use server"

  try {
    const config = getRadarrConfig()
    const movies = (await makeRadarrRequest(
      `movie?tmdbId=${tmdbId}`,
      config,
    )) as RadarrResponse[]
    return movies.length > 0 ? movies[0] : null
  } catch (error) {
    console.error(
      `Failed to check if movie exists in Radarr (TMDB ID: ${tmdbId}):`,
      error,
    )
    return null
  }
}

export async function getUserMovieByTmdbId(
  tmdbId: number,
  userSettings: UserRadarrSettings,
): Promise<RadarrResponse | null> {
  "use server"

  try {
    if (!isUserRadarrConfigured(userSettings)) {
      return null
    }

    const config: RadarrConfig = {
      baseUrl: userSettings.radarrUrl!,
      apiKey: userSettings.radarrApiKey!,
      rootFolder: userSettings.radarrRootFolder || "/movies",
      qualityProfileId: userSettings.radarrQualityProfileId || 1,
      monitored: userSettings.radarrMonitored,
    }

    const movies = (await makeRadarrRequest(
      `movie?tmdbId=${tmdbId}`,
      config,
    )) as RadarrResponse[]
    return movies.length > 0 ? movies[0] : null
  } catch (error) {
    console.error(
      `Failed to check if movie exists in user's Radarr (TMDB ID: ${tmdbId}):`,
      error,
    )
    return null
  }
}

export async function searchMovieInRadarr(movieId: number): Promise<void> {
  "use server"

  try {
    const config = getRadarrConfig()
    await makeRadarrRequest("command", config, "POST", {
      name: "MoviesSearch",
      movieIds: [movieId],
    })
    console.log(`Initiated search for movie ID: ${movieId}`)
  } catch (error) {
    console.error(`Failed to search for movie ID ${movieId}:`, error)
  }
}

export async function testRadarrConnection(): Promise<boolean> {
  "use server"

  try {
    if (!isRadarrConfigured()) {
      return false
    }
    const config = getRadarrConfig()
    await makeRadarrRequest("system/status", config)
    return true
  } catch (error) {
    console.error("Radarr connection test failed:", error)
    return false
  }
}

export { isRadarrConfigured, isUserRadarrConfigured }
