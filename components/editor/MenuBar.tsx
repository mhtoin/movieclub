import { useMutation } from "@tanstack/react-query";
import type { Editor } from "@tiptap/react";
import { Button } from "components/ui/Button";
import {
	BoldIcon,
	Code,
	CodeIcon,
	Heading1,
	Heading2,
	Heading3,
	Heading4,
	Heading5,
	Heading6,
	ItalicIcon,
	List,
	ListOrdered,
	Pilcrow,
	Quote,
	Redo,
	RemoveFormattingIcon,
	Save,
	SeparatorHorizontal,
	StrikethroughIcon,
	Undo,
	Workflow,
	WrapText,
} from "lucide-react";
import { toast } from "sonner";

export const MenuBar = ({
	editor,
	id,
}: { editor: Editor | null; id: string }) => {
	if (!editor) {
		return null;
	}

	const iconVariant = "outline";
	const iconSize = "iconSm";

	const saveReviewMutation = useMutation({
		mutationFn: async () => {
			const content = editor.getJSON();

			const res = await fetch(`/api/reviews?id=${id}`, {
				method: "POST",
				body: JSON.stringify({ content }),
			});
			return res.json();
		},
		onSuccess: () => {
			toast.success("Review saved");
		},
		onError: () => {
			toast.error("Failed to save review");
		},
	});

	return (
		<div className="flex flex-row gap-2">
			<div className="flex flex-row flex-wrap gap-2">
				<Button
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={editor.isActive("bold") ? "bg-accent" : ""}
					variant={iconVariant}
					size={iconSize}
				>
					<BoldIcon className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={editor.isActive("italic") ? "bg-accent" : ""}
					variant={iconVariant}
					size={iconSize}
				>
					<ItalicIcon className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().toggleStrike().run()}
					className={editor.isActive("strike") ? "bg-accent" : ""}
					variant={iconVariant}
					size={iconSize}
				>
					<StrikethroughIcon className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().toggleCode().run()}
					className={editor.isActive("code") ? "bg-accent" : ""}
					variant={iconVariant}
					size={iconSize}
				>
					<CodeIcon className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().unsetAllMarks().run()}
					variant={iconVariant}
					size={iconSize}
				>
					<RemoveFormattingIcon className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().clearNodes().run()}
					variant={iconVariant}
					size={iconSize}
				>
					<Workflow className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().setParagraph().run()}
					className={editor.isActive("paragraph") ? "bg-accent" : ""}
					variant={iconVariant}
					size={iconSize}
				>
					<Pilcrow className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
					className={editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""}
					variant={iconVariant}
					size={iconSize}
				>
					<Heading1 className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					className={editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""}
					variant={iconVariant}
					size={iconSize}
				>
					<Heading2 className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
					className={editor.isActive("heading", { level: 3 }) ? "bg-accent" : ""}
					variant={iconVariant}
					size={iconSize}
				>
					<Heading3 className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
					className={editor.isActive("heading", { level: 4 }) ? "bg-accent" : ""}
					variant={iconVariant}
					size={iconSize}
				>
					<Heading4 className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
					className={editor.isActive("heading", { level: 5 }) ? "bg-accent" : ""}
					variant={iconVariant}
					size={iconSize}
				>
					<Heading5 className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
					className={editor.isActive("heading", { level: 6 }) ? "bg-accent" : ""}
					variant={iconVariant}
					size={iconSize}
				>
					<Heading6 className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={editor.isActive("bulletList") ? "bg-accent" : ""}
					variant={iconVariant}
					size={iconSize}
				>
					<List className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={editor.isActive("orderedList") ? "bg-accent" : ""}
					variant={iconVariant}
					size={iconSize}
				>
					<ListOrdered className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					className={editor.isActive("codeBlock") ? "bg-accent" : ""}
					variant={iconVariant}
					size={iconSize}
				>
					<Code className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					className={editor.isActive("blockquote") ? "bg-accent" : ""}
					variant={iconVariant}
					size={iconSize}
				>
					<Quote className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().setHorizontalRule().run()}
					variant={iconVariant}
					size={iconSize}
				>
					<SeparatorHorizontal className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().setHardBreak().run()}
					variant={iconVariant}
					size={iconSize}
				>
					<WrapText className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().undo().run()}
					variant={iconVariant}
					size={iconSize}
				>
					<Undo className="h-4 w-4" />
				</Button>
				<Button
					onClick={() => editor.chain().focus().redo().run()}
					variant={iconVariant}
					size={iconSize}
				>
					<Redo className="h-4 w-4" />
				</Button>
			</div>
			<div className="flex flex-row gap-2">
				<Button
					variant={iconVariant}
					size={iconSize}
					isLoading={saveReviewMutation.isPending}
					onClick={() => saveReviewMutation.mutate()}
				>
					<Save className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
};
