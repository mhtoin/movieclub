import {
  addMovieToRadarr,
  isRadarrConfigured,
  testRadarrConnection,
} from "@/lib/radarr"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    if (!isRadarrConfigured()) {
      return NextResponse.json(
        {
          configured: false,
          message:
            "Radarr is not configured. Please set RADARR_URL and RADARR_API_KEY environment variables.",
        },
        { status: 400 },
      )
    }

    const isConnected = await testRadarrConnection()

    if (isConnected) {
      return NextResponse.json({
        configured: true,
        connected: true,
        message: "Radarr connection successful",
      })
    } else {
      return NextResponse.json(
        {
          configured: true,
          connected: false,
          message: "Radarr is configured but connection failed",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        configured: isRadarrConfigured(),
        connected: false,
        message: `Radarr connection error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isRadarrConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Radarr is not configured. Please set RADARR_URL and RADARR_API_KEY environment variables.",
        },
        { status: 400 },
      )
    }

    const { tmdbId, title, releaseDate } = await request.json()

    if (!tmdbId || !title || !releaseDate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: tmdbId, title, and releaseDate are required",
        },
        { status: 400 },
      )
    }

    const result = await addMovieToRadarr(tmdbId, title, releaseDate)

    if (result) {
      return NextResponse.json({
        success: true,
        message: `Successfully added "${title}" to Radarr`,
        movie: result,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to add "${title}" to Radarr`,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Error adding movie to Radarr: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
