import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { webhookUrl, content, imageBlob } = await request.json()

    if (!webhookUrl || !content || !imageBlob) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    // Convert base64 to buffer
    const base64Data = imageBlob.split(",")[1]
    const buffer = Buffer.from(base64Data, "base64")
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
      return NextResponse.json(
        { error: "Failed to post to Discord" },
        { status: 500 },
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
