import RomanticImg from '../../../../assets/images/genres/Romantic.jpg';
import HeroicImg from '../../../../assets/images/genres/Heroic.jpg';
import FantasyImg from '../../../../assets/images/genres/Fantasy.jpg';
import CrimeImg from '../../../../assets/images/genres/Crime.jpg';
import HorrorImg from '../../../../assets/images/genres/Horrorobj.jpg';
import styles from './ImageCarousel.module.scss';

const ImageCarousel = ({ activeImageIndex }) => {
  const carouselImages = [
    { id: 1, image: RomanticImg, alt: 'Romantic' },
    { id: 2, image: HeroicImg, alt: 'Heroic' },
    { id: 3, image: FantasyImg, alt: 'Fantasy' },
    { id: 4, image: CrimeImg, alt: 'Crime' },
    { id: 5, image: HorrorImg, alt: 'Horror' }
  ];

  return (
    <>
      {carouselImages.map((item, index) => (
        <div
          key={item.id}
          className={`${styles.carouselImage} ${
            index === activeImageIndex ? styles.activeImage : ''
          }`}
          style={{
            backgroundImage: `url(${item.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
          role="img"
          aria-label={item.alt}
        />
      ))}
    </>
  );
};

export default ImageCarousel;
