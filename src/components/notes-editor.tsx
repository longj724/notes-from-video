"use client";

// External Dependencies
import { forwardRef, useImperativeHandle, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "tiptap-extension-font-size";
import { Extension } from "@tiptap/core";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
} from "lucide-react";
import _ from "lodash";

// Internal Dependencies
import { Card } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Toggle } from "./ui/toggle";
import { Timestamp } from "./extensions/timestamp";
import { AISuggestion } from "./extensions/ai-suggestion";
import { useUpdateNote } from "@/hooks/use-notes";
import { Note, Transcription } from "@/lib/types";
import { useAskQuestion } from "@/hooks/use-ask-question";
const DEBOUNCE_MS = 1000;

// Create a custom extension for tab support
const TabKeyExtension = Extension.create({
  name: "tabKey",
  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        if (editor.isActive("bulletList") || editor.isActive("orderedList")) {
          editor.commands.sinkListItem("listItem");
          return true;
        }
        editor.commands.insertContent("\t");
        return true;
      },
      "Shift-Tab": ({ editor }) => {
        if (editor.isActive("bulletList") || editor.isActive("orderedList")) {
          editor.commands.liftListItem("listItem");
          return true;
        }
        return false;
      },
    };
  },
});

const fontSizes = [
  "8px",
  "9px",
  "10px",
  "11px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "22px",
  "24px",
  "26px",
  "28px",
  "36px",
  "48px",
  "72px",
] as const;

type FontSize = (typeof fontSizes)[number];

const fontFamilies = [
  { label: "Arial", value: "Arial" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Courier New", value: "Courier New" },
  { label: "Georgia", value: "Georgia" },
  { label: "Verdana", value: "Verdana" },
] as const;

type FontFamily = (typeof fontFamilies)[number]["value"];

export interface NotesEditorRef {
  insertTextWithTimestamp: (text: string, timestamp: number) => void;
  getContent: () => string;
}

interface NotesEditorProps {
  onTimestampClick?: (seconds: number) => void;
  note?: Note;
  transcript?: Transcription[];
}

export const NotesEditor = forwardRef<NotesEditorRef, NotesEditorProps>(
  function NotesEditor({ onTimestampClick, note, transcript }, ref) {
    const { mutate: askQuestion, data: questionResponse } = useAskQuestion();

    const { mutate: updateNote } = useUpdateNote();

    const debouncedUpdateNote = useCallback(
      _.debounce((noteId: string, content: string) => {
        updateNote({
          id: noteId,
          content,
          skipInvalidation: true,
        });
      }, DEBOUNCE_MS),
      [updateNote],
    );

    const onContentChange = (content: string) => {
      if (note) {
        debouncedUpdateNote(note.id, content);
      }
    };

    const handleAICommand = (question: string) => {
      if (transcript) {
        askQuestion({ question, transcript });
      }
    };

    const editor = useEditor(
      {
        extensions: [
          StarterKit.configure({
            bulletList: {
              HTMLAttributes: {
                class: "list-disc list-outside leading-3 ml-4",
              },
            },
            orderedList: {
              HTMLAttributes: {
                class: "list-decimal list-outside leading-3 ml-4",
              },
            },
            listItem: {
              HTMLAttributes: {
                class: "my-2",
              },
            },
          }),
          Underline,
          TextAlign.configure({
            types: ["heading", "paragraph", "listItem"],
            alignments: ["left", "center", "right"],
            defaultAlignment: "left",
          }),
          TextStyle,
          FontFamily.configure({
            types: ["textStyle"],
          }),
          FontSize.configure({
            types: ["textStyle"],
          }),
          TabKeyExtension,
          Timestamp.configure({
            HTMLAttributes: {},
            onClick: onTimestampClick,
          }),
          AISuggestion.configure({
            onAICommand: handleAICommand,
          }),
        ],
        content: note?.content ?? "",
        editorProps: {
          attributes: {
            class:
              "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
          },
        },
        onUpdate: ({ editor }) => {
          onContentChange(editor.getHTML());
        },
      },
      [transcript],
    );

    useEffect(() => {
      if (editor && note?.content !== undefined) {
        if (editor.getHTML() !== note?.content) {
          editor.commands.setContent(note?.content);
        }
      }
    }, [editor, note]);

    useEffect(() => {
      if (editor && questionResponse?.answer) {
        // Insert two newlines and the AI response
        editor
          .chain()
          .focus()
          .createParagraphNear()
          .insertContent("\n")
          .insertContent("AI Response: ")
          .insertContent(questionResponse.answer)
          .run();
      }
    }, [editor, questionResponse]);

    useImperativeHandle(ref, () => ({
      insertTextWithTimestamp: (text: string, timestamp: number) => {
        if (editor) {
          const formattedTime = formatTime(timestamp);
          editor
            .chain()
            .focus()
            .setTimestamp(timestamp)
            .insertContent(` [${formattedTime}]`)
            .unsetTimestamp()
            .insertContent(" ")
            .insertContent(text)
            .run();
        }
      },
      getContent: () => {
        return editor?.getHTML() ?? "";
      },
    }));

    if (!editor) {
      return null;
    }

    const getFontSize = (): FontSize => {
      const attrs = editor.getAttributes("textStyle");
      return (attrs?.fontSize as FontSize) ?? "16px";
    };

    const getFontFamily = (): FontFamily => {
      const attrs = editor.getAttributes("textStyle");
      return (attrs?.fontFamily as FontFamily) ?? "Arial";
    };

    const handleTextAlign = (alignment: "left" | "center" | "right") => {
      if (editor.isActive({ textAlign: alignment })) {
        editor.chain().focus().setTextAlign("left").run();
      } else {
        editor.chain().focus().setTextAlign(alignment).run();
      }
    };

    return (
      <Card className="h-full p-4">
        <div className="mb-2 border-b pb-2">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Select
              value={getFontSize()}
              onValueChange={(value: FontSize) =>
                editor.chain().focus().setFontSize(value).run()
              }
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Font size" />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={getFontFamily()}
              onValueChange={(value: FontFamily) =>
                editor.chain().focus().setFontFamily(value).run()
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem
                    key={font.value}
                    value={font.value}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Toggle
              size="sm"
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Toggle>

            <Toggle
              size="sm"
              pressed={editor.isActive("italic")}
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
            >
              <Italic className="h-4 w-4" />
            </Toggle>

            <Toggle
              size="sm"
              pressed={editor.isActive("underline")}
              onPressedChange={() =>
                editor.chain().focus().toggleUnderline().run()
              }
            >
              <UnderlineIcon className="h-4 w-4" />
            </Toggle>

            <div className="mx-2 h-4 w-[1px] bg-border" />

            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "left" })}
              onPressedChange={() => handleTextAlign("left")}
            >
              <AlignLeft className="h-4 w-4" />
            </Toggle>

            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "center" })}
              onPressedChange={() => handleTextAlign("center")}
            >
              <AlignCenter className="h-4 w-4" />
            </Toggle>

            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "right" })}
              onPressedChange={() => handleTextAlign("right")}
            >
              <AlignRight className="h-4 w-4" />
            </Toggle>

            <div className="mx-2 h-4 w-[1px] bg-border" />

            <Toggle
              size="sm"
              pressed={editor.isActive("bulletList")}
              onPressedChange={() =>
                editor.chain().focus().toggleBulletList().run()
              }
              aria-label="Bullet list"
            >
              <List className="h-4 w-4" />
            </Toggle>

            <Toggle
              size="sm"
              pressed={editor.isActive("orderedList")}
              onPressedChange={() =>
                editor.chain().focus().toggleOrderedList().run()
              }
              aria-label="Numbered list"
            >
              <ListOrdered className="h-4 w-4" />
            </Toggle>
          </div>
        </div>

        <EditorContent
          editor={editor}
          className="min-h-[500px] focus:outline-none"
        />
      </Card>
    );
  },
);

NotesEditor.displayName = "NotesEditor";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
