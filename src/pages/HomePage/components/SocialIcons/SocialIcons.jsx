import { SOCIAL_LINKS } from '../../../../utils/constants';
import gmailLogo from '../../../../assets/images/social/gmail-logo.png';
import facebookLogo from '../../../../assets/images/social/facebook-logo.png';
import instagramLogo from '../../../../assets/images/social/instagram-logo.png';
import youtubeLogo from '../../../../assets/images/social/youtube-logo.png';
import styles from './SocialIcons.module.scss';

const SocialIcons = ({ onYouTubeClick }) => {
  return (
    <div className={styles.socialIcons}>
      <a href={SOCIAL_LINKS.EMAIL} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
        <img src={gmailLogo} alt="Gmail" />
      </a>

      <a href={SOCIAL_LINKS.FACEBOOK} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
        <img src={facebookLogo} alt="Facebook" />
      </a>

      <a href={SOCIAL_LINKS.INSTAGRAM} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
        <img src={instagramLogo} alt="Instagram" />
      </a>

      <a href="#" onClick={onYouTubeClick} className={styles.socialIcon}>
        <img src={youtubeLogo} alt="YouTube" />
      </a>
    </div>
  );
};

export default SocialIcons;
