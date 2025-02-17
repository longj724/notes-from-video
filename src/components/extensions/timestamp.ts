import { Mark, mergeAttributes } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    timestamp: {
      setTimestamp: (time: number) => ReturnType;
      unsetTimestamp: () => ReturnType;
    };
  }
}

export interface TimestampOptions {
  HTMLAttributes: Record<string, unknown>;
  onClick?: (time: number) => void;
}

interface TimestampAttributes {
  time: number | null;
}

export const Timestamp = Mark.create<TimestampOptions>({
  name: "timestamp",

  addOptions() {
    return {
      HTMLAttributes: {},
      onClick: undefined,
    };
  },

  addAttributes() {
    return {
      time: {
        default: null,
        parseHTML: (element): number | null => {
          const value = element.getAttribute("data-time");
          return value ? parseInt(value, 10) : null;
        },
        renderHTML: (attributes: TimestampAttributes) => {
          if (!attributes.time) {
            return {};
          }

          return {
            "data-time": attributes.time.toString(),
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-time]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(
        { class: "cursor-pointer text-blue-500 hover:text-blue-700" },
        HTMLAttributes,
        {
          "data-timestamp-mark": "true",
        },
      ),
      0,
    ];
  },

  addProseMirrorPlugins() {
    const { onClick } = this.options;

    return [
      new Plugin({
        props: {
          handleClick(view: EditorView, pos: number, event: MouseEvent) {
            const target = event.target as HTMLElement;
            if (!target.hasAttribute("data-timestamp-mark")) {
              return false;
            }

            const timeStr = target.getAttribute("data-time");
            if (timeStr && onClick) {
              const time = parseInt(timeStr, 10);
              if (!isNaN(time)) {
                onClick(time);
                return true;
              }
            }

            return false;
          },
        },
      }),
    ];
  },

  addCommands() {
    return {
      setTimestamp:
        (time: number) =>
        ({ commands }) => {
          return commands.setMark(this.name, { time });
        },
      unsetTimestamp:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
