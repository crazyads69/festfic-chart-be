export interface WattpadStory {
  id: number;
  title: string;
  description: string;
  author: string;
  cover: string;
  url: string;
  reads: number;
  votes: number;
  comments: number;
  modifyDate: string;
  createDate: string;
  parts: WattpadPart[];
}

export interface WattpadPart {
  id: number;
  title: string;
  url: string;
  rating: number;
  draft: boolean;
  modifyDate: Date;
  createDate: Date;
  length: number;
  videoId: string;
  photoUrl: string;
  commentCount: number;
  voteCount: number;
  readCount: number;
}
