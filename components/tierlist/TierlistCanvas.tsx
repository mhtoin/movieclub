"use client"
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import type { TierlistWithTiers } from "@/types/tierlist.type"

interface ShareSettings {
  includeUserInfo: boolean
  includeTitle: boolean
  includeDateRange: boolean
  includeGenres: boolean
  backgroundColor: string
  textColor: string
  quality: "high" | "medium" | "low"
}

interface TierlistCanvasProps {
  tierlist: TierlistWithTiers
  settings: ShareSettings
}

const TierlistCanvas = forwardRef<HTMLCanvasElement, TierlistCanvasProps>(
  ({ tierlist, settings }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useImperativeHandle(ref, () => canvasRef.current!, [])

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas size based on quality
      const scale =
        settings.quality === "high"
          ? 3
          : settings.quality === "medium"
            ? 1.5
            : 1
      const width = 1200 * scale
      const height = calculateCanvasHeight(tierlist, settings) * scale

      canvas.width = width
      canvas.height = height
      canvas.style.width = `${width / scale}px`
      canvas.style.height = `${height / scale}px`

      // Scale the context to match
      ctx.scale(scale, scale)

      drawTierlist(ctx, tierlist, settings, width / scale, height / scale)
    }, [tierlist, settings])

    const calculateCanvasHeight = (
      tierlist: TierlistWithTiers,
      settings: ShareSettings,
    ): number => {
      let height = 100 // Base padding

      if (settings.includeTitle) height += 60
      if (settings.includeUserInfo) height += 40
      if (settings.includeDateRange && tierlist.watchDate) height += 30
      if (settings.includeGenres && tierlist.genres?.length) height += 40

      // Add height for tiers - calculate dynamic height based on content
      const validTiers = tierlist.tiers.filter((tier) => tier.movies.length > 0)
      const canvasWidth = 1200
      const tierLabelWidth = 150
      const movieWidth = 120
      const movieHeight = 200
      const moviesPerRow = Math.floor(
        (canvasWidth - tierLabelWidth - 40) / (movieWidth + 10),
      )

      for (const tier of validTiers) {
        const rows = Math.ceil(tier.movies.length / moviesPerRow)
        const tierHeight = Math.max(200, rows * (movieHeight + 10) + 20) // Dynamic height with minimum
        height += tierHeight + 20 // Add some spacing between tiers
      }

      return Math.max(height, 600) // Minimum height
    }

    const drawTierlist = async (
      ctx: CanvasRenderingContext2D,
      tierlist: TierlistWithTiers,
      settings: ShareSettings,
      canvasWidth: number,
      canvasHeight: number,
    ) => {
      // Clear canvas
      ctx.fillStyle = settings.backgroundColor
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      // Find the most recently watched movie
      let mostRecentMovie: TierlistWithTiers["tiers"][0]["movies"][0] | null =
        null
      let mostRecentDate: Date | null = null

      for (const tier of tierlist.tiers) {
        for (const movie of tier.movies) {
          if (movie.movie.watchDate) {
            const watchDate = new Date(movie.movie.watchDate)
            if (!mostRecentDate || watchDate > mostRecentDate) {
              mostRecentDate = watchDate
              mostRecentMovie = movie
            }
          }
        }
      }

      let currentY = 40

      // Draw title
      if (settings.includeTitle) {
        ctx.fillStyle = settings.textColor
        ctx.font =
          'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        ctx.textAlign = "center"
        ctx.fillText(
          tierlist.title || "Movie Tierlist",
          canvasWidth / 2,
          currentY,
        )
        currentY += 60
      }

      // Draw user info
      if (settings.includeUserInfo && tierlist.userId) {
        ctx.fillStyle = settings.textColor
        ctx.font =
          '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        ctx.textAlign = "center"
        ctx.globalAlpha = 0.8
        ctx.fillText(`Created by User`, canvasWidth / 2, currentY)
        ctx.globalAlpha = 1
        currentY += 40
      }

      // Draw date range
      if (settings.includeDateRange && tierlist.watchDate) {
        const fromDate = new Date(
          tierlist.watchDate.from as string,
        ).toLocaleDateString()
        const toDate = new Date(
          tierlist.watchDate.to as string,
        ).toLocaleDateString()

        ctx.fillStyle = settings.textColor
        ctx.font =
          '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        ctx.textAlign = "center"
        ctx.globalAlpha = 0.7
        ctx.fillText(`${fromDate} - ${toDate}`, canvasWidth / 2, currentY)
        ctx.globalAlpha = 1
        currentY += 30
      }

      // Draw genres
      if (settings.includeGenres && tierlist.genres?.length) {
        ctx.fillStyle = settings.textColor
        ctx.font =
          '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        ctx.textAlign = "center"
        ctx.globalAlpha = 0.6
        ctx.fillText(
          `Genres: ${tierlist.genres.join(", ")}`,
          canvasWidth / 2,
          currentY,
        )
        ctx.globalAlpha = 1
        currentY += 40
      }

      // Draw tiers
      const validTiers = tierlist.tiers
        .filter((tier) => tier.movies.length > 0)
        .sort((a, b) => a.value - b.value)

      for (const tier of validTiers) {
        const tierHeight = await drawTier(
          ctx,
          tier,
          currentY,
          canvasWidth,
          settings,
          mostRecentMovie,
        )
        currentY += tierHeight + 20 // Add spacing between tiers
      }
    }

    const drawTier = async (
      ctx: CanvasRenderingContext2D,
      tier: TierlistWithTiers["tiers"][0],
      y: number,
      canvasWidth: number,
      settings: ShareSettings,
      mostRecentMovie: TierlistWithTiers["tiers"][0]["movies"][0] | null,
    ): Promise<number> => {
      const tierLabelWidth = 150
      const movieWidth = 120
      const movieHeight = 200
      const movieSpacing = 10
      const rowSpacing = 10

      // Calculate how many movies can fit per row
      const moviesPerRow = Math.floor(
        (canvasWidth - tierLabelWidth - 40) / (movieWidth + movieSpacing),
      )

      // Calculate actual tier height based on number of rows needed
      const rows = Math.ceil(tier.movies.length / moviesPerRow)
      const tierHeight = Math.max(160, rows * (movieHeight + rowSpacing) + 20)

      // Draw tier label background with rounded corners
      const tierColor = getTierColor(tier.value)
      ctx.fillStyle = tierColor

      // Draw rounded rectangle
      const radius = 8 // Adjust this value to make corners more or less rounded
      ctx.beginPath()
      ctx.moveTo(20 + radius, y)
      ctx.lineTo(20 + tierLabelWidth - radius, y)
      ctx.quadraticCurveTo(
        20 + tierLabelWidth,
        y,
        20 + tierLabelWidth,
        y + radius,
      )
      ctx.lineTo(20 + tierLabelWidth, y + tierHeight - radius)
      ctx.quadraticCurveTo(
        20 + tierLabelWidth,
        y + tierHeight,
        20 + tierLabelWidth - radius,
        y + tierHeight,
      )
      ctx.lineTo(20 + radius, y + tierHeight)
      ctx.quadraticCurveTo(20, y + tierHeight, 20, y + tierHeight - radius)
      ctx.lineTo(20, y + radius)
      ctx.quadraticCurveTo(20, y, 20 + radius, y)
      ctx.closePath()
      ctx.fill()

      // Draw tier label text
      ctx.fillStyle = "#000000"
      ctx.font =
        'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.textAlign = "center"
      ctx.fillText(tier.label, 20 + tierLabelWidth / 2, y + tierHeight / 2 + 8)

      // Draw movies with proper wrapping
      const sortedMovies = tier.movies.sort((a, b) => a.position - b.position)

      for (let i = 0; i < sortedMovies.length; i++) {
        const movie = sortedMovies[i]
        const row = Math.floor(i / moviesPerRow)
        const col = i % moviesPerRow

        const x = 20 + tierLabelWidth + 10 + col * (movieWidth + movieSpacing)
        const movieY = y + 10 + row * (movieHeight + rowSpacing)

        await drawMovie(
          ctx,
          movie,
          x,
          movieY,
          movieWidth,
          movieHeight,
          settings,
          mostRecentMovie,
        )
      }

      return tierHeight
    }

    const drawMovie = async (
      ctx: CanvasRenderingContext2D,
      movie: TierlistWithTiers["tiers"][0]["movies"][0],
      x: number,
      y: number,
      width: number,
      height: number,
      settings: ShareSettings,
      mostRecentMovie: TierlistWithTiers["tiers"][0]["movies"][0] | null,
    ) => {
      // Check if this is the most recently watched movie
      const isRecent = mostRecentMovie && mostRecentMovie.id === movie.id

      // Calculate proper poster dimensions maintaining aspect ratio
      const posterHeight = height - 20 // Leave space for title
      const posterWidth = width

      // Draw movie poster background
      ctx.fillStyle = "#2a2a3e"
      ctx.fillRect(x, y, posterWidth, posterHeight)

      // Draw highlight border for most recent movie
      if (isRecent) {
        const borderWidth = 4
        const glowColor = "oklch(0.7188 0.1238 19.55)"

        // Draw outer glow effect
        ctx.save()
        ctx.shadowColor = glowColor
        ctx.shadowBlur = 15
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.strokeStyle = glowColor
        ctx.lineWidth = borderWidth
        ctx.strokeRect(
          x - borderWidth / 2,
          y - borderWidth / 2,
          posterWidth + borderWidth,
          posterHeight + borderWidth,
        )
        ctx.restore()

        // Draw inner border
        ctx.strokeStyle = glowColor
        ctx.lineWidth = borderWidth
        ctx.strokeRect(x, y, posterWidth, posterHeight)
      }

      // Try to load and draw movie poster
      if (movie.movie.images?.posters?.[0]?.file_path) {
        try {
          const img = new Image()
          img.crossOrigin = "anonymous"

          await new Promise<void>((resolve) => {
            img.onload = () => {
              // Calculate dimensions to maintain aspect ratio
              const imgAspectRatio = img.width / img.height
              const containerAspectRatio = posterWidth / posterHeight

              let drawWidth = posterWidth
              let drawHeight = posterHeight
              let drawX = x
              let drawY = y

              if (imgAspectRatio > containerAspectRatio) {
                // Image is wider than container - fit by height
                drawWidth = posterHeight * imgAspectRatio
                drawX = x + (posterWidth - drawWidth) / 2
              } else {
                // Image is taller than container - fit by width
                drawHeight = posterWidth / imgAspectRatio
                drawY = y + (posterHeight - drawHeight) / 2
              }

              // Clip to the poster area to prevent overflow
              ctx.save()
              ctx.beginPath()
              ctx.rect(x, y, posterWidth, posterHeight)
              ctx.clip()

              ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
              ctx.restore()
              resolve()
            }
            img.onerror = () => {
              // Fallback: draw placeholder
              drawMoviePlaceholder(
                ctx,
                movie.movie.title,
                x,
                y,
                posterWidth,
                posterHeight,
                settings,
              )
              resolve()
            }
            img.src = `https://image.tmdb.org/t/p/w300${movie.movie.images?.posters?.[0]?.file_path}`
          })
        } catch (error) {
          drawMoviePlaceholder(
            ctx,
            movie.movie.title,
            x,
            y,
            posterWidth,
            posterHeight,
            settings,
          )
        }
      } else {
        drawMoviePlaceholder(
          ctx,
          movie.movie.title,
          x,
          y,
          posterWidth,
          posterHeight,
          settings,
        )
      }

      // Draw movie title
      ctx.fillStyle = settings.textColor
      ctx.font =
        '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.textAlign = "center"

      const title = movie.movie.title
      const maxWidth = width - 4
      const truncatedTitle = truncateText(ctx, title, maxWidth)

      ctx.fillText(truncatedTitle, x + width / 2, y + height - 5)

      // Add "LATEST" badge for most recent movie

      if (isRecent) {
        const badgeY = y + height - 50
        const badgeWidth = 50
        const badgeHeight = 16
        const badgeX = x + width - badgeWidth - 5

        // Draw badge background
        ctx.fillStyle = "oklch(0.7188 0.1238 19.55)"
        ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight)

        // Draw badge text
        ctx.fillStyle = "#000000"
        ctx.font =
          'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        ctx.textAlign = "center"
        ctx.fillText(
          "LATEST",
          badgeX + badgeWidth / 2,
          badgeY + badgeHeight / 2 + 3,
        )
      }
    }

    const drawMoviePlaceholder = (
      ctx: CanvasRenderingContext2D,
      title: string,
      x: number,
      y: number,
      width: number,
      height: number,
      settings: ShareSettings,
    ) => {
      // Draw placeholder background
      ctx.fillStyle = "#404040"
      ctx.fillRect(x, y, width, height)

      // Draw title in placeholder
      ctx.fillStyle = settings.textColor
      ctx.font =
        '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.textAlign = "center"

      const words = title.split(" ")
      let lines: string[] = []
      let currentLine = ""

      for (const word of words) {
        const testLine = currentLine + (currentLine ? " " : "") + word
        const metrics = ctx.measureText(testLine)

        if (metrics.width > width - 8 && currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = testLine
        }
      }

      if (currentLine) {
        lines.push(currentLine)
      }

      // Limit to 3 lines
      lines = lines.slice(0, 3)

      const lineHeight = 16
      const totalHeight = lines.length * lineHeight
      const startY = y + height / 2 - totalHeight / 2 + lineHeight / 2

      lines.forEach((line, index) => {
        ctx.fillText(line, x + width / 2, startY + index * lineHeight)
      })
    }

    const getTierColor = (value: number): string => {
      const colors = [
        "oklch(0.7188 0.1238 19.55)",
        "oklch(0.8511 0.0886 336.25)",
        "oklch(0.7644 0.1113 311.98)",
        "oklch(0.7766 0.0727 228.62)",
        "oklch(0.7857 0.0715 185.28)",
        "oklch(0.8133 0.1069 133.48)",
        "oklch(0.8949 0.0336 31.16)",
      ]

      if (value >= 6) return colors[0] // S tier
      if (value >= 5) return colors[1] // A tier
      if (value >= 4) return colors[2] // B tier
      if (value >= 3) return colors[3] // C tier
      if (value >= 2) return colors[4] // D tier
      if (value >= 1) return colors[5] // F tier
      return colors[6] // Unranked
    }

    const truncateText = (
      ctx: CanvasRenderingContext2D,
      text: string,
      maxWidth: number,
    ): string => {
      if (ctx.measureText(text).width <= maxWidth) {
        return text
      }

      let truncated = text
      while (
        ctx.measureText(truncated + "...").width > maxWidth &&
        truncated.length > 0
      ) {
        truncated = truncated.slice(0, -1)
      }

      return truncated + "..."
    }

    return (
      <canvas
        ref={canvasRef}
        className="border rounded-lg"
        style={{ backgroundColor: settings.backgroundColor }}
      />
    )
  },
)

TierlistCanvas.displayName = "TierlistCanvas"

export default TierlistCanvas
