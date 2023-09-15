import { storage } from '../../App';

function createAlbum(newUri, path) {
  // fetch and then restore stored images
  let images = [newUri];
  let imageData = JSON.stringify(images);
  storage.set(path, imageData);

  // create new album
  const albumsJSON = storage.getString('albums');
  let albums = null;
  if (albumsJSON) {
    albums = JSON.parse(albumsJSON);
  } else {
    albums = [];
  }

  let arrayData = JSON.stringify([{ name: path, image: newUri }, ...albums]);
  storage.set('albums', arrayData);
}

export default createAlbum;
