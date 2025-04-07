export interface Contact {
  id: number;
  name: string;
  email: string;
  company: string;
  contacted: boolean;
  createdAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
}

export interface ContactStats {
  total: number;
  contacted: number;
}

export type SortField = "name" | "email" | "company" | "createdAt";
export type SortDirection = "asc" | "desc";
export type FilterValue = "all" | "contacted" | "not-contacted";

export interface SortState {
  field: SortField;
  direction: SortDirection;
}
