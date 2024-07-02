export interface Snippet {
  snippetID?: number;
  name: string;
  code: string;
  tags: string;
  author: string;
  authorID: string;
  favoriteCount: number;
  isFavorite: boolean;
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
