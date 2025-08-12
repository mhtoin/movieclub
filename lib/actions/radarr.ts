"use server"

import { getCurrentSession } from "@/lib/authentication/session"
import prisma from "@/lib/prisma"
import { addMovieToUserRadarr, isUserRadarrConfigured } from "@/lib/radarr"

export async function testUserRadarrConnection(
  radarrUrl: string,
  radarrApiKey: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!radarrUrl || !radarrApiKey) {
      return { success: false, error: "URL and API key are required" }
    }

    // Test the connection with a simple system status call
    const apiUrl = `${radarrUrl.trim().replace(/\/$/, "")}/api/v3/system/status?apikey=${radarrApiKey}`

    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `Connection failed: ${response.status} ${response.statusText} - ${errorText}`,
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Radarr connection test failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function addMovieToCurrentUserRadarr(
  tmdbId: number,
  title: string,
  releaseDate: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getCurrentSession()
    if (!session?.user?.id) {
      return { success: false, error: "User not authenticated" }
    }

    // Get user's Radarr settings
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        radarrUrl: true,
        radarrApiKey: true,
        radarrRootFolder: true,
        radarrQualityProfileId: true,
        radarrMonitored: true,
        radarrEnabled: true,
      },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    const userSettings = {
      radarrUrl: user.radarrUrl,
      radarrApiKey: user.radarrApiKey,
      radarrRootFolder: user.radarrRootFolder,
      radarrQualityProfileId: user.radarrQualityProfileId,
      radarrMonitored: user.radarrMonitored,
      radarrEnabled: user.radarrEnabled,
    }

    if (!isUserRadarrConfigured(userSettings)) {
      return { success: false, error: "Radarr is not configured for this user" }
    }

    const result = await addMovieToUserRadarr(
      tmdbId,
      title,
      releaseDate,
      userSettings,
    )

    if (result) {
      return { success: true }
    } else {
      return { success: false, error: "Failed to add movie to Radarr" }
    }
  } catch (error) {
    console.error("Failed to add movie to user Radarr:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
