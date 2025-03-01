// External Dependencies
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import type { Instance, Props } from "tippy.js";
import tippy from "tippy.js";
import { createRoot } from "react-dom/client";

// Internal Dependencies
import { AICommandList } from "../ai-command-list";

export interface AISuggestionOptions {
  onAICommand?: (command: string) => void;
}

interface PopupState {
  instance: Instance<Props>;
  root: ReturnType<typeof createRoot>;
}

export const AISuggestion = Extension.create<AISuggestionOptions>({
  name: "aiSuggestion",

  addOptions() {
    return {
      onAICommand: undefined,
    };
  },

  addProseMirrorPlugins() {
    const { onAICommand } = this.options;
    let popupState: PopupState | null = null;

    return [
      new Plugin({
        key: new PluginKey("aiSuggestion"),

        view: () => {
          return {
            update: (view: EditorView) => {
              const { selection } = view.state;
              const { $from } = selection;
              const textBefore = $from.nodeBefore?.text ?? "";

              // Check if we're typing "/ai"
              if (textBefore.endsWith("/ai")) {
                // Create popup if it doesn't exist
                if (!popupState) {
                  const coords = view.coordsAtPos(selection.from);
                  const container = document.createElement("div");

                  const instance = tippy(view.dom, {
                    getReferenceClientRect: () => ({
                      width: 0,
                      height: 0,
                      x: coords.left,
                      y: coords.top,
                      top: coords.top,
                      left: coords.left,
                      right: coords.left,
                      bottom: coords.top,
                      toJSON() {
                        return "";
                      },
                    }),
                    appendTo: () => document.body,
                    content: container,
                    showOnCreate: true,
                    interactive: true,
                    trigger: "manual",
                    placement: "bottom-start",
                    zIndex: 50,
                    theme: "light",
                    arrow: false,
                    animation: false,
                    offset: [0, 8],
                    popperOptions: {
                      modifiers: [
                        {
                          name: "computeStyles",
                          options: {
                            gpuAcceleration: false,
                          },
                        },
                      ],
                    },
                  });

                  const popperElement = instance.popper;
                  if (popperElement instanceof HTMLElement) {
                    popperElement.style.background = "transparent";
                    popperElement.style.backdropFilter = "none";
                    // popperElement.style.border = "none";
                    // popperElement.style.padding = "0";
                    // Apply webkit prefix using setAttribute for cross-browser support
                    popperElement.setAttribute(
                      "style",
                      `${popperElement.getAttribute("style") ?? ""}; -webkit-backdrop-filter: none;`,
                    );

                    // Remove tippy-box styles
                    const tippyBox = popperElement.querySelector(".tippy-box");
                    if (tippyBox instanceof HTMLElement) {
                      tippyBox.style.background = "transparent";
                      tippyBox.style.border = "none";
                      tippyBox.style.padding = "0";
                      tippyBox.style.borderRadius = "12px";
                    }

                    const tippyContent =
                      popperElement.querySelector(".tippy-content");
                    if (tippyContent instanceof HTMLElement) {
                      tippyContent.style.padding = "0px";
                    }
                  }

                  const root = createRoot(container);
                  root.render(
                    <AICommandList
                      onSubmit={(command: string) => {
                        // Remove the /ai text
                        const { state } = view;
                        const { tr } = state;
                        tr.delete($from.pos - 3, $from.pos);
                        view.dispatch(tr);

                        // Call the onAICommand callback
                        onAICommand?.(command);

                        if (popupState) {
                          popupState.instance.destroy();
                          popupState.root.unmount();
                          popupState = null;
                        }
                      }}
                      onClose={() => {
                        if (popupState) {
                          popupState.instance.destroy();
                          popupState.root.unmount();
                          popupState = null;
                        }
                      }}
                    />,
                  );

                  popupState = {
                    instance,
                    root,
                  };
                }
              } else if (popupState) {
                // Destroy popup if we're not typing /ai anymore
                popupState.instance.destroy();
                popupState.root.unmount();
                popupState = null;
              }
            },

            destroy: () => {
              if (popupState) {
                popupState.instance.destroy();
                popupState.root.unmount();
                popupState = null;
              }
            },
          };
        },
      }),
    ];
  },
});
