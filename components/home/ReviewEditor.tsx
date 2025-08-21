'use client'

import { MenuBar } from '@/components/editor/MenuBar'
import type { MovieWithReviews } from '@/types/movie.type'
import { EditorContent, type JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface ReviewEditorProps {
  movie: MovieWithReviews
  existingContent?: string | JSONContent
  onSave: (content: JSONContent) => void
  isLoading?: boolean
}

const ReviewEditor = ({ movie, existingContent, onSave, isLoading = false }: ReviewEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: existingContent || '<p></p>',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base prose-neutral dark:prose-invert m-5 h-full focus:outline-hidden ul-li-p-reset',
      },
    },
  })

  const handleSave = () => {
    if (editor) {
      const content = editor.getJSON()
      onSave(content)
    }
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <MenuBar 
        editor={editor} 
        id={movie.id} 
        onSave={handleSave}
        isLoading={isLoading}
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