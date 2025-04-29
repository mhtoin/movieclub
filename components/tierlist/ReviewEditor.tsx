"use client";

import { MenuBar } from "@/components/editor/MenuBar";
import type { TierMovieWithMovieData } from "@/types/tierlist.type";
import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const ReviewEditor = ({ movieData }: { movieData: TierMovieWithMovieData }) => {
	const editor = useEditor({
		extensions: [StarterKit],
		content: movieData.review ? (movieData.review as JSONContent) : "<p></p>",
		editorProps: {
			attributes: {
				class:
					"prose prose-sm sm:prose-base prose-neutral dark:prose-invert ul-li-p-reset m-5 h-full focus:outline-hidden",
			},
		},
	});

	return (
		<div className="flex flex-col h-full gap-2">
			<MenuBar editor={editor} id={movieData.id} />
			<div className="grow overflow-hidden relative">
				<EditorContent
					editor={editor}
					className="absolute inset-0 bg-input rounded-md overflow-y-auto text-foreground"
				/>
			</div>
		</div>
	);
};

export default ReviewEditor;
