"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "./button";
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Code,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Kbd, KbdGroup } from "./kbd";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const RichTextEditor = ({
  value = "",
  onChange,
  disabled = false,
}: RichTextEditorProps) => {
  // Force re-renders when editor state changes
  const [, setUpdateCounter] = useState(0);
  const forceUpdate = () => setUpdateCounter((prev) => prev + 1);

  // Track editor focus state
  const [isFocused, setIsFocused] = useState(false);

  // Parse JSON content safely
  const parseContent = useCallback((val: string) => {
    if (!val || val === "") return "";
    try {
      return JSON.parse(val);
    } catch {
      return val; // Fallback to string if not valid JSON
    }
  }, []);

  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm max-w-none min-h-[200px] w-full rounded-b-md border border-t border-input bg-background px-3 py-2 shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:my-3 prose-p:leading-relaxed break-all overflow-x-hidden",
      },
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: parseContent(value),
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const json = JSON.stringify(editor.getJSON());
      onChange?.(json);
      forceUpdate(); // Update active states
    },
    onSelectionUpdate: () => {
      forceUpdate(); // Update active states when selection changes
    },
    onFocus: () => {
      setIsFocused(true);
    },
    onBlur: () => {
      setIsFocused(false);
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (!editor || !value) return;

    const currentContent = JSON.stringify(editor.getJSON());
    const newContent = parseContent(value);
    const newContentString =
      typeof newContent === "string" ? newContent : JSON.stringify(newContent);

    // Only update if content actually changed
    if (currentContent !== newContentString) {
      editor.commands.setContent(newContent);
    }
  }, [editor, value, parseContent]);

  // Update editor editable state when disabled prop changes
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full space-y-0">
      {/* Toolbar */}
      <div
        className={cn(
          "bg-card border-input flex flex-wrap items-center gap-0.5 rounded-t-md border border-b p-1 shadow-xs transition-[color,box-shadow]",
          isFocused && "border-ring ring-ring/50 ring-[3px]",
        )}
      >
        {/* Text Formatting */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={editor.isActive("bold") ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={disabled}
              className="h-8 w-8"
            >
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2">
              Bold
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>B</Kbd>
              </KbdGroup>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={editor.isActive("italic") ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={disabled}
              className="h-8 w-8"
            >
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2">
              Italic
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>I</Kbd>
              </KbdGroup>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={editor.isActive("strike") ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={disabled}
              className="h-8 w-8"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Strikethrough</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={editor.isActive("code") ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={disabled}
              className="h-8 w-8"
            >
              <Code className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2">
              Code
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>E</Kbd>
              </KbdGroup>
            </div>
          </TooltipContent>
        </Tooltip>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Lists */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              disabled={disabled}
              className="h-8 w-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bullet List</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              disabled={disabled}
              className="h-8 w-8"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Numbered List</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              disabled={disabled}
              className="h-8 w-8"
            >
              <Quote className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Blockquote</p>
          </TooltipContent>
        </Tooltip>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Undo/Redo */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={disabled || !editor.can().undo()}
              className="h-8 w-8"
            >
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2">
              Undo
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>Z</Kbd>
              </KbdGroup>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={disabled || !editor.can().redo()}
              className="h-8 w-8"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2">
              Redo
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>Y</Kbd>
              </KbdGroup>
            </div>
          </TooltipContent>
        </Tooltip>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Headings */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={
                editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"
              }
              size="icon-sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              disabled={disabled}
              className="h-8 w-8"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading 1</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={
                editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
              }
              size="icon-sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              disabled={disabled}
              className="h-8 w-8"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading 2</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={
                editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"
              }
              size="icon-sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              disabled={disabled}
              className="h-8 w-8"
            >
              <Heading3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading 3</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
