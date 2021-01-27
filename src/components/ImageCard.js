import React from 'react'

const ImageCard = (props) => {
  const [spans, setSpans] = React.useState(0)
  const imageRef = React.useRef(null)

  React.useEffect(() => {
    imageRef.current?.addEventListener("load", setSpanItems);
  })

  const setSpanItems = () => {
    console.log('height', imageRef.current?.clientHeight);
    const height = imageRef.current?.clientHeight;
    const spanItem = Math.ceil(height / 10);
    setSpans(spanItem)
  }
  const { urls, alt_description } = props.image;
  return <div style={{ gridRowEnd: `span ${spans}` }}>
    <img ref={imageRef} key={props.index} onClick={() => props.openSlideshow(props.index)}
      src={urls?.thumb} alt={alt_description} />
  </div>

}

export default ImageCard