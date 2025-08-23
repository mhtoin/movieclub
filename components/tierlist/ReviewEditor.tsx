"use client"

import { MenuBar } from "@/components/editor/MenuBar"
import { EditorContent, useEditor } from "@tiptap/react"
import type { Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect } from "react"

const ReviewEditor = ({
  reviewData,
  movieId,
  userId,
  editorRef,
}: {
  reviewData?: { id: string; content: string } | null
  movieId: string
  userId?: string
  editorRef?: React.MutableRefObject<Editor | null>
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: JSON.parse(reviewData?.content || "{}"),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base prose-neutral dark:prose-invert m-5 h-full focus:outline-hidden ul-li-p-reset",
      },
    },
  })

  // Update the ref whenever the editor changes
  useEffect(() => {
    if (editorRef && editor) {
      editorRef.current = editor
    }
  }, [editor, editorRef])

  return (
    <div className="flex h-full flex-col gap-2">
      <MenuBar
        editor={editor}
        reviewId={reviewData?.id}
        movieId={movieId}
        userId={userId}
      />
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
