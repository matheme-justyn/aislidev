/**
 * Presentation data types
 */

export interface Presentation {
  id: string;
  title: string;
  content: string;
  theme: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePresentationInput {
  title: string;
  content?: string;
  theme?: string;
}

export interface UpdatePresentationInput {
  title?: string;
  content?: string;
  theme?: string;
}

export interface PresentationMetadata {
  id: string;
  title: string;
  theme: string;
  createdAt: string;
  updatedAt: string;
}
