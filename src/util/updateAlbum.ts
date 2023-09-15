import { storage } from '../../App';

function updateAlbum(newUri, albumName) {
  // fetch and then restore stored images
  let imagesJSON = storage.getString(albumName);

  let images = JSON.parse(imagesJSON);
  images = [newUri, ...images];

  imageData = JSON.stringify(images);
  storage.set(albumName, imageData);
}

export default updateAlbum;
