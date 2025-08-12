import { getCurrentSession } from "@/lib/authentication/session"
import prisma from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const { user } = await getCurrentSession()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      radarrUrl: userData.radarrUrl || "",
      radarrApiKey: userData.radarrApiKey ? "••••••••" : "", // Mask the API key for security
      radarrRootFolder: userData.radarrRootFolder || "",
      radarrQualityProfileId: userData.radarrQualityProfileId || 1,
      radarrMonitored: userData.radarrMonitored,
      radarrEnabled: userData.radarrEnabled,
    })
  } catch (error) {
    console.error("Error getting user Radarr settings:", error)
    return NextResponse.json(
      { error: "Failed to get Radarr settings" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user } = await getCurrentSession()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      radarrUrl,
      radarrApiKey,
      radarrRootFolder,
      radarrQualityProfileId,
      radarrMonitored,
      radarrEnabled,
    } = await request.json()

    // Basic validation
    if (radarrEnabled && (!radarrUrl || !radarrApiKey)) {
      return NextResponse.json(
        { error: "URL and API key are required when Radarr is enabled" },
        { status: 400 },
      )
    }

    // Prepare update data - only update API key if it's not the masked value
    const updateData: Record<string, unknown> = {
      radarrUrl: radarrUrl || null,
      radarrRootFolder: radarrRootFolder || null,
      radarrQualityProfileId: radarrQualityProfileId || 1,
      radarrMonitored: Boolean(radarrMonitored),
      radarrEnabled: Boolean(radarrEnabled),
    }

    // Only update API key if it's not the masked value
    if (radarrApiKey && radarrApiKey !== "••••••••") {
      updateData.radarrApiKey = radarrApiKey
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    })

    return NextResponse.json({
      message: "Radarr settings updated successfully",
      settings: {
        radarrUrl: updatedUser.radarrUrl || "",
        radarrApiKey: updatedUser.radarrApiKey ? "••••••••" : "",
        radarrRootFolder: updatedUser.radarrRootFolder || "",
        radarrQualityProfileId: updatedUser.radarrQualityProfileId || 1,
        radarrMonitored: updatedUser.radarrMonitored,
        radarrEnabled: updatedUser.radarrEnabled,
      },
    })
  } catch (error) {
    console.error("Error updating user Radarr settings:", error)
    return NextResponse.json(
      { error: "Failed to update Radarr settings" },
      { status: 500 },
    )
  }
}
