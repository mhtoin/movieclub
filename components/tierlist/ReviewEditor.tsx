"use client";

import { MenuBar } from "@/components/editor/MenuBar";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const ReviewEditor = ({ id }: { id: string }) => {
	const editor = useEditor({
		extensions: [StarterKit],
		content: "",
		editorProps: {
			attributes: {
				class:
					"prose prose-sm sm:prose-base prose-neutral dark:prose-invert ul-li-p-reset m-5 h-full focus:outline-none",
			},
		},
	});

	return (
		<div className="flex flex-col h-full gap-2">
			<MenuBar editor={editor} id={id} />
			<div className="flex-grow overflow-hidden relative">
				<EditorContent
					editor={editor}
					className="absolute inset-0 bg-input rounded-md overflow-y-auto text-foreground"
				/>
			</div>
		</div>
	);
};

export default ReviewEditor;
