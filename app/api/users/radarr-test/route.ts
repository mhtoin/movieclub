import { getCurrentSession } from "@/lib/authentication/session"
import { testUserRadarrConnection } from "@/lib/actions/radarr"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST() {
  try {
    const { user } = await getCurrentSession()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's stored Radarr settings from database
    const userSettings = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        radarrUrl: true,
        radarrApiKey: true,
        radarrEnabled: true,
      },
    })

    if (!userSettings?.radarrUrl || !userSettings?.radarrApiKey) {
      return NextResponse.json(
        {
          error:
            "Radarr configuration not found. Please save your settings first.",
        },
        { status: 400 },
      )
    }

    if (!userSettings.radarrEnabled) {
      return NextResponse.json(
        { error: "Radarr is not enabled in your settings" },
        { status: 400 },
      )
    }

    const result = await testUserRadarrConnection(
      userSettings.radarrUrl,
      userSettings.radarrApiKey,
    )

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
