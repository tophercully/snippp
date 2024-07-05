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
}
export interface SnippetInBuilder {
  authorID: string;
  author: string;
  name: string;
  code: string;
  tags: string;
  public: boolean;
}

export interface SnippetList {
  listID: number;
  userID: string;
  listName: string;
  description?: string;
  createdAt: Date;
  lastUpdated: Date;
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

export interface SnipppUser {
  userID: number;
  username: string;
  email: string;
  created_at: number;
}
