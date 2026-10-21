/** Paleta cerrada de colores de texto de las notas. El color real lo pone global.css por tema */
export const NOTE_TONES = ["rojo", "ambar", "verde", "azul"] as const;
export type NoteTone = (typeof NOTE_TONES)[number];

export const NOTE_TONE_LABELS: Record<NoteTone, string> = {
  rojo: "Rojo",
  ambar: "Ámbar",
  verde: "Verde",
  azul: "Azul",
};

export const isNoteTone = (value: unknown): value is NoteTone =>
  typeof value === "string" && (NOTE_TONES as readonly string[]).includes(value);
