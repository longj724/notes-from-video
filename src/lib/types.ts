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
  createdAt: string;
  folderId: string | null;
  content: string | null;
};

export type Transcription = {
  text: string;
  duration: number;
  offset: number;
};
