import { Mark, mergeAttributes } from "@tiptap/core";
import { isNoteTone, type NoteTone } from "./palette";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tono: {
      setTono: (tono: NoteTone) => ReturnType;
      unsetTono: () => ReturnType;
    };
  }
}

/**
 * Color de texto de la paleta cerrada. Guarda el NOMBRE del tono (data-tono="rojo"), no un
 * hexadecimal: global.css le da el color de cada tema, y no hay estilos en línea.
 */
export const ToneMark = Mark.create({
  name: "tono",

  addAttributes() {
    return {
      tono: {
        default: null,
        parseHTML: (el) => {
          const value = el.getAttribute("data-tono");
          return isNoteTone(value) ? value : null;
        },
        renderHTML: (attrs) => (isNoteTone(attrs.tono) ? { "data-tono": attrs.tono } : {}),
      },
    };
  },

  parseHTML() {
    // Al pegar, solo se reconoce un tono de la paleta; cualquier otro color se descarta
    return [
      {
        tag: "span[data-tono]",
        getAttrs: (el) =>
          isNoteTone((el as HTMLElement).getAttribute("data-tono")) ? null : false,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { class: "nota-tono" }), 0];
  },

  addCommands() {
    return {
      setTono:
        (tono) =>
        ({ commands }) =>
          commands.setMark(this.name, { tono }),
      unsetTono:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});
