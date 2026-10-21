import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Italic from "@tiptap/extension-italic";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { ToneMark } from "./tone-mark";

/** El esquema del editor: exactamente lo que admite noteContentSchema (y nada más) */
export const noteExtensions = [Document, Paragraph, Text, Bold, Italic, ToneMark];
