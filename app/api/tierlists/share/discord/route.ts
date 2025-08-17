import { NextRequest, NextResponse } from "next/server"

// Discord webhook file size limit is 8MB
const DISCORD_FILE_SIZE_LIMIT = 8 * 1024 * 1024 // 8MB in bytes

export async function POST(request: NextRequest) {
  try {
    const { content, imageBlob } = await request.json()
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL

    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Discord webhook URL not configured" },
        { status: 500 },
      )
    }

    if (!content || !imageBlob) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    // Convert base64 to buffer
    const base64Data = imageBlob.split(",")[1]
    const buffer = Buffer.from(base64Data, "base64")

    // Check if the image is too large for Discord
    if (buffer.length > DISCORD_FILE_SIZE_LIMIT) {
      console.error(
        `Image size (${(buffer.length / 1024 / 1024).toFixed(2)}MB) exceeds Discord limit (8MB)`,
      )
      return NextResponse.json(
        {
          error:
            "Image is too large for Discord. Please try reducing the quality setting to 'low' or 'medium' and try again.",
        },
        { status: 413 },
      )
    }

    const uint8Array = new Uint8Array(buffer)

    // Create form data for Discord webhook
    const formData = new FormData()
    formData.append("content", content)
    formData.append(
      "file",
      new Blob([uint8Array], { type: "image/png" }),
      "tierlist.png",
    )

    // Send to Discord webhook
    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      body: formData,
    })

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text()
      console.error("Discord webhook error:", errorText)

      // Parse Discord error for better user feedback
      let errorMessage = "Failed to post to Discord"
      try {
        const errorJson = JSON.parse(errorText)
        if (errorJson.code === 40005) {
          errorMessage =
            "Image is too large for Discord. Please try reducing the quality setting."
        } else if (errorJson.message) {
          errorMessage = `Discord error: ${errorJson.message}`
        }
      } catch {
        // Keep default error message if parsing fails
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: discordResponse.status },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error posting to Discord:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
