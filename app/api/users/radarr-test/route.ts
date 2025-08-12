import { getCurrentSession } from "@/lib/authentication/session"
import { testUserRadarrConnection } from "@/lib/actions/radarr"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { user } = await getCurrentSession()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { radarrUrl, radarrApiKey } = body

    if (!radarrUrl || !radarrApiKey) {
      return NextResponse.json(
        { error: "Radarr URL and API key are required" },
        { status: 400 },
      )
    }

    const result = await testUserRadarrConnection(radarrUrl, radarrApiKey)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Radarr connection test successful!",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Radarr test error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
