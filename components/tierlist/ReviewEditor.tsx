"use client"

import { MenuBar } from "@/components/editor/MenuBar"
import { MovieWithReviews } from "@/types/movie.type"
import type { TierMovieWithMovieData } from "@/types/tierlist.type"
import { Review } from "@prisma/client"
import { EditorContent, type JSONContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

const ReviewEditor = ({
  reviewData,
  movieId,
}: {
  reviewData?: Review
  movieId: string
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: reviewData?.content || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base prose-neutral dark:prose-invert m-5 h-full focus:outline-hidden ul-li-p-reset",
      },
    },
  })

  return (
    <div className="flex h-full flex-col gap-2">
      <MenuBar editor={editor} id={movieId} />
      <div className="relative grow overflow-hidden">
        <EditorContent
          editor={editor}
          className="bg-input text-foreground absolute inset-0 overflow-y-auto rounded-md"
        />
      </div>
    </div>
  )
}

export default ReviewEditor
