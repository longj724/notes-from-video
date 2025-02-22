export type TranscriptionItem = {
  id: string;
  title: string;
  videoId: string;
  createdAt: Date;
};

export type Note = {
  id: string;
  title: string;
  videoUrl: string;
  createdAt: Date;
  folderId: string | null;
};
