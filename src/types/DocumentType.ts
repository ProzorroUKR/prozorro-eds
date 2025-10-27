export type DocumentType = Record<string, string> & {
  id: string;
  documentType?: string;
  title: string;
  description?: string;
  format?: string;
  url: string;
  dateModified?: string;
  datePublished?: string;
  language?: string;
  documentOf?: "tender" | "item" | "lot";
  relatedItem?: string;
};
