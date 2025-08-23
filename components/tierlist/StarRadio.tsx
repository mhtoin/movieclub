import { useCreateOrUpdateReviewMutation } from "@/lib/reviews/mutations"
import { Loader2, Star } from "lucide-react"
import { useState } from "react"

interface StarRadioProps {
  value?: number
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  name?: string
  reviewId?: string
  movieId?: string
  userId?: string
  readOnly?: boolean
}

export default function StarRadio({
  value = 0,
  size = "md",
  disabled = false,
  name = "star-rating",
  reviewId,
  movieId,
  userId,
  readOnly = false,
}: StarRadioProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const reviewMutation = useCreateOrUpdateReviewMutation(
    userId || "",
    movieId || "",
  )

  // Size classes for the stars
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  }

  // Stroke width based on size
  const strokeWidth = {
    sm: 2,
    md: 2.5,
    lg: 3,
  }

  // Animation classes for wave effect
  const getAnimationClasses = (index: number): string => {
    if (!reviewMutation.isPending) return ""

    // Use different animation delay classes based on index
    const delayClasses = [
      "delay-0",
      "delay-100",
      "delay-200",
      "delay-300",
      "delay-400",
    ]

    return `animate-star-wave ${delayClasses[index]}`
  }

  // Calculate the display value (either the hover value or the actual value)
  const displayValue = hoverValue !== null ? hoverValue : value

  // Handle mouse movement over a star to determine quarter increments
  const handleMouseMove = (
    event: React.MouseEvent<HTMLLabelElement>,
    starIndex: number,
  ) => {
    if (disabled || reviewMutation.isPending || readOnly) return

    const { left, width } = event.currentTarget.getBoundingClientRect()
    const position = (event.clientX - left) / width

    // Calculate quarter increments (0, 0.25, 0.5, 0.75, 1)
    let quarterValue = 0
    if (position <= 0.25) quarterValue = 0.25
    else if (position <= 0.5) quarterValue = 0.5
    else if (position <= 0.75) quarterValue = 0.75
    else quarterValue = 1

    setHoverValue(starIndex + quarterValue)
  }

  // Handle click on a star
  const handleClick = (event: React.MouseEvent) => {
    if (disabled || hoverValue === null || reviewMutation.isPending || readOnly)
      return

    // Prevent the event from triggering the radio input's default behavior
    event.preventDefault()

    // Save the rating using the mutation
    reviewMutation.mutate({
      rating: hoverValue,
      reviewId,
    })
  }

  // Handle keyboard events for accessibility
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLLabelElement>,
    starIndex: number,
  ) => {
    if (disabled || reviewMutation.isPending || readOnly) return

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      reviewMutation.mutate({
        rating: starIndex + 1,
        reviewId,
      })
    }
  }

  // Handle mouse leaving the star rating component
  const handleMouseLeave = () => {
    if (!isDragging) {
      setHoverValue(null)
    }
  }

  // Handle mouse down for drag functionality
  const handleMouseDown = () => {
    if (!disabled && !reviewMutation.isPending && !readOnly) {
      setIsDragging(true)
    }
  }

  // Handle mouse up to end dragging
  const handleMouseUp = (event: React.MouseEvent) => {
    if (
      isDragging &&
      hoverValue !== null &&
      !reviewMutation.isPending &&
      !readOnly
    ) {
      // Only call the mutation if this is not a click event (which is handled separately)
      // Check if the event target is not a label element
      if (!(event.target instanceof HTMLLabelElement)) {
        reviewMutation.mutate({
          rating: hoverValue,
          reviewId,
        })
      }
      setIsDragging(false)
    }
  }

  // Render a star with the appropriate fill level
  const renderStar = (starIndex: number) => {
    const difference = displayValue - starIndex
    let fillPercentage = 0

    if (difference >= 1) {
      fillPercentage = 100
    } else if (difference > 0) {
      // Convert the difference to a percentage (0-100)
      fillPercentage = Math.min(Math.round(difference * 100), 100)
    }

    return (
      <div className="group relative">
        {/* Base star (outline) */}
        <Star
          className={`${sizeClasses[size]} stroke-yellow-400 transition-all duration-200 ${
            reviewMutation.isPending ? "opacity-70" : ""
          }`}
          fill="transparent"
          strokeWidth={strokeWidth[size]}
        />

        {/* Filled portion of the star */}
        <div
          className="absolute inset-0 overflow-hidden transition-all duration-200 ease-out"
          style={{ width: `${fillPercentage}%` }}
        >
          <Star
            className={`${sizeClasses[size]} stroke-yellow-400 ${
              reviewMutation.isPending ? "opacity-70" : ""
            }`}
            fill="rgb(250 204 21)" // text-yellow-400 equivalent
            strokeWidth={strokeWidth[size]}
          />
        </div>

        {/* Hover indicator - shows the potential fill amount */}
        {!disabled && !reviewMutation.isPending && !readOnly && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="flex h-1/2 w-1/2 items-center justify-center rounded-full bg-yellow-400/20">
              {fillPercentage > 0 && (
                <span
                  className={`text-[8px] font-bold ${fillPercentage > 25 ? "text-background" : "text-white"}`}
                >
                  {Math.round(fillPercentage)}%
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      type="button"
      className="flex items-center gap-2"
      onMouseLeave={handleMouseLeave}
      onMouseUp={(e) => handleMouseUp(e)}
      onMouseDown={handleMouseDown}
    >
      {[0, 1, 2, 3, 4].map((starIndex) => (
        <div
          key={starIndex}
          className={`relative ${getAnimationClasses(starIndex)}`}
        >
          <input
            type="radio"
            id={`${name}-${starIndex + 1}`}
            name={name}
            value={starIndex + 1}
            defaultChecked={Math.floor(displayValue) === starIndex + 1}
            className="sr-only" // Visually hidden but accessible
            disabled={disabled || reviewMutation.isPending}
          />
          <label
            htmlFor={`${name}-${starIndex + 1}`}
            className={`cursor-pointer transition-transform duration-200 hover:scale-110 ${
              disabled || reviewMutation.isPending || readOnly
                ? "cursor-not-allowed opacity-60 hover:scale-100"
                : ""
            }`}
            onMouseMove={(e) => handleMouseMove(e, starIndex)}
            onClick={(e) => handleClick(e)}
            onKeyDown={(e) => handleKeyDown(e, starIndex)}
            tabIndex={disabled || reviewMutation.isPending || readOnly ? -1 : 0}
          >
            {renderStar(starIndex)}
          </label>
        </div>
      ))}

      {/* Display the numeric value or loading spinner */}
      {reviewMutation.isPending ? (
        <span className="ml-3 flex items-center rounded-md bg-yellow-100 px-2 py-1 text-yellow-800">
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Saving...</span>
        </span>
      ) : displayValue > 0 ? (
        <span className="ml-3 rounded-md bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-800 transition-all duration-200">
          {displayValue.toFixed(2)}
        </span>
      ) : null}
    </button>
  )
}
