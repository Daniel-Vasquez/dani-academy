/** Formato del archivo de copia de seguridad (lo escribe backup.ts y lo lee restore-test.ts) */
import type { Document } from "mongodb";

export const BACKUP_FORMAT = "dani-academy-backup/1";

export interface BackupCollection {
  name: string;
  /** Opciones de createCollection: validator, validationLevel, validationAction… */
  options: Document;
  /** Especificaciones de índices (sin el _id_, que se crea solo) */
  indexes: Document[];
  /** Documentos ordenados por _id */
  documents: Document[];
}

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  db: string;
  createdAt: string;
  collections: BackupCollection[];
}
