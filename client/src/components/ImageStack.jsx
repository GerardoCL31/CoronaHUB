export default function ImageStack({ as = "div", className = "", imageClassName = "", images = [] }) {
  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }

  const Tag = as;

  return (
    <Tag className={className}>
      {images.map((image, index) => (
        <img
          key={`${image.src}-${index}`}
          className={imageClassName || undefined}
          src={image.src}
          alt={image.alt}
        />
      ))}
    </Tag>
  );
}
