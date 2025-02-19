// typeInterfaces.ts

export interface User {
  userID: string;
  name: string;
  email: string;
  profile_picture: string;
  createdAt: Date;
  last_login: Date;
  bio?: string;
  role: "user" | "admin" | "moderator";
}

export interface Snippet {
  snippetID: number;
  name: string;
  code: string;
  description: string;
  tags: string;
  author: string;
  authorID: string;
  public: boolean;
  createdAt?: Date;
  lastCopied: Date | null;
  lastEdit: Date | null;
  copyCount: number;
  favoriteCount: number;
  isFavorite: boolean;
  forkedFrom?: number | null;
  forkedFromName?: string | null;
  forkCount?: number | null;
}
export interface SnippetInBuilder {
  authorID: string;
  author: string;
  name: string;
  code: string;
  description: string;
  tags: string;
  public: boolean;
  forkedFrom?: number | null;
  forkedFromName?: string | null;
}

export interface SnippetList {
  listID: number;
  userID: string;
  listName: string;
  description?: string;
  createdAt: Date;
  lastUpdated: Date;
  author: string;
  staffPick?: boolean;
}

export interface ListData {
  listid: string | number;
  author?: string;
  userid: string;
  listname: string;
  description: string;
  createdat: string;
  lastupdated: string;
  snippet_count?: string;
  staffpick?: boolean;
  listtags?: string[];
}

export interface ListSnippet {
  listID: number;
  snippetID: number;
  addedAt: Date;
}

export interface Favorite {
  userID: string;
  snippetID: number;
}

export interface GoogleUser {
  id: string;
  name: string;
  givenName: string;
  familyName: string;
  email: string;
  verified_email: boolean;
  picture: string;
}

export interface SnipppProfile {
  userId: string;
  name: string;
  email: string;
  profile_picture: string;
  bio: string;
  last_login: string;
  created_at?: string;
  role?: "user" | "admin" | "moderator" | "banned";
}

export interface EditableUserFields {
  id: string;
  name?: string;
  bio?: string;
  profilePicture?: string;
}

export type SortOrder = "asc" | "desc";

export type SnippetMod = {
  favoriteStatus?: boolean;
  favoriteCount?: number;
  copyCount?: number;
  isDeleted?: boolean;
};
