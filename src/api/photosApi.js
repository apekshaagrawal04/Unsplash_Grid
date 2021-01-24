import { createApi } from 'unsplash-js';

export const unsplash = createApi({
  accessKey: 'ayZbZOEbAWnBZXO5bG3kBBePrLhYGZae0mHMbCmbGYM',
});


export const getPhotos = (pageNum, pageLimit) => {
  return unsplash.photos.list({ page: pageNum, perPage: pageLimit }).then(data => {
    return data.response
  })
}