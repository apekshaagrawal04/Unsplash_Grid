import React from 'react'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { getPhotos } from '../api/photosApi'
import InfiniteScroll from "react-infinite-scroll-component";
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  imgClass: {
    cursor: 'pointer',
    marginBottom: '10px'
  },
  infiniteScrollComponent: {
    width: '100%',
    maxWidth: '1100px',
    minWidth: '800px',
    margin: '20px auto'
  },
  photoContainer: {
    display: 'inline-block',
  }
}))
let finalPhotos = []
const GridComponent = () => {
  const classes = useStyles()
  const [photoList, setPhotoList] = React.useState([])
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [currentPage, setCurrentPage] = React.useState(0)
  const [totalCount, setTotalCount] = React.useState(0)
  const [hasMore, setHasMore] = React.useState(true)

  React.useEffect(() => {
    getPhotos(0, 12).then((res) => {
      finalPhotos = res.results
      setPhotoList(res.results)
      setTotalCount(res.total)
    })
    setCurrentPage(1)
  }, [setCurrentPage])

  const handleClose = () => {
    setIsOpen(false)
  }

  const openSlideshow = (index) => {
    setIsOpen(true)
    setCurrentSlide(index)
  }

  const fetchMoreData = React.useCallback(() => {
    if (totalCount && (photoList.length >= totalCount)) {
      setHasMore(false)
      return false
    }
    getPhotos(currentPage, 12).then((result) => {
      const finalList = finalPhotos.concat(result.results)
      finalPhotos = finalList
      if (JSON.stringify(photoList) !== JSON.stringify(finalList))
        setPhotoList(finalList)
    })
  }, [setPhotoList, currentPage, totalCount, photoList])


  const handleLoadMore = React.useCallback(() => {
    let finalPage = currentPage + 1
    if (currentPage !== finalPage) {
      setCurrentPage(finalPage)
    }
    fetchMoreData()
  }, [fetchMoreData, currentPage])


  return <>
    <InfiniteScroll
      dataLength={photoList.length}
      next={handleLoadMore}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>All the Images are loaded.</b>
        </p>
      }
      className={classes.infiniteScrollComponent}>
      <div className="grid">
        {photoList.map((photo, index) => {
          return <div key={index} className={classes.photoContainer}>
            <img className={classes.imgClass} key={index} onClick={() => openSlideshow(index)}
              src={photo.urls?.thumb} alt={photo.alt_description} />
          </div>
        })}
      </div>
    </InfiniteScroll>
    {isOpen && (
      <Lightbox
        mainSrc={photoList[currentSlide].urls.regular}
        nextSrc={photoList[(currentSlide + 1) % photoList.length].urls.regular}
        prevSrc={photoList[(currentSlide + photoList.length - 1) % photoList.length].urls.regular}
        onCloseRequest={handleClose}
        onMovePrevRequest={() =>
          setCurrentSlide((currentSlide + photoList.length - 1) % photoList.length)
        }
        onMoveNextRequest={() =>
          setCurrentSlide((currentSlide + 1) % photoList.length)
        }
        animationOnKeyInput={true}
        imageTitle={photoList[currentSlide].user.name}
        imageCaption={photoList[currentSlide].user.bio}
      />
    )}
  </>
}
export default GridComponent
