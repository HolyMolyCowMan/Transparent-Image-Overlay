export type Routes = {
  Camera: {
    album: string | null;
    newAlbum: boolean | null;
    imageURI: string | null;
  };
  Media: {
    path: string;
    type: 'video' | 'photo';
    album: string | null;
    newAlbum: boolean | null;
  };
  AlbumSelector: {
    newUri: string;
    path: string | null;
  };
};
