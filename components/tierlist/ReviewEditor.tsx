/*
'use client'

import { MenuBar } from '@/components/editor/MenuBar'
import type { TierMovieWithMovieData } from '@/types/tierlist.type'
import { EditorContent, type JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const ReviewEditor = ({ movieData }: { movieData: TierMovieWithMovieData }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: movieData.review ? (movieData.review as JSONContent) : '<p></p>',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base prose-neutral dark:prose-invert m-5 h-full focus:outline-hidden ul-li-p-reset',
      },
    },
  })

  return (
    <div className="flex h-full flex-col gap-2">
      <MenuBar editor={editor} id={movieData.id} />
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
*/
