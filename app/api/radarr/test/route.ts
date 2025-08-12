import { getCurrentSession } from "@/lib/authentication/session"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  console.log("GET request received")
  try {
    const { user } = await getCurrentSession()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userSettings = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        radarrUrl: true,
        radarrApiKey: true,
        radarrEnabled: true,
        radarrRootFolder: true,
        radarrMonitored: true,
      },
    })
    // Hardcoded movie (The Shawshank Redemption)
    const movie = {
      title: "The Shawshank Redemption",
      tmdbId: 278, // TMDB ID for The Shawshank Redemption
      year: 1994,
      qualityProfileId: 1, // Default quality profile ID, adjust as needed
      rootFolderPath: userSettings?.radarrRootFolder || "/movies", // Default root folder, adjust as needed
      monitored: true,
      minimumAvailability: "released",
      addOptions: {
        searchForMovie: true,
      },
    }

    // Radarr API details
    const radarrApiKey = userSettings?.radarrApiKey
    const radarrUrl = userSettings?.radarrUrl || "http://localhost:7878"

    if (!radarrApiKey) {
      return NextResponse.json(
        { error: "Radarr API key not configured" },
        { status: 500 },
      )
    }

    // Call Radarr API to add the movie
    const response = await fetch(`${radarrUrl}/api/v3/movie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": radarrApiKey,
      },
      body: JSON.stringify(movie),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: `Failed to add movie to Radarr: ${error}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error adding movie to Radarr:", error)
    return NextResponse.json(
      { error: "Failed to add movie to Radarr" },
      { status: 500 },
    )
  }
}
