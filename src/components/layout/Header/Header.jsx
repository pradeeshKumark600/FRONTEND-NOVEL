import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { translations } from '../../../translations';
import logo from '../../../assets/images/brand/TTM NOVRLS.png';
import styles from './Header.module.scss';

const Header = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const languageDropdownRef = useRef(null);

  const t = translations[language];

  // Close dropdown when clicking outside or pressing ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsLanguageDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isLanguageDropdownOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguageDropdown = (e) => {
    e.stopPropagation();
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setIsLanguageDropdownOpen(false);
    // Force re-render by scrolling to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Add search functionality here
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Left Section: Hamburger Menu & Logo */}
        <div className={styles.leftSection}>
          {/* Hamburger Menu */}
          <button
            className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Logo */}
          <div className={styles.logoContainer} onClick={() => navigate('/novels')} style={{ cursor: 'pointer' }}>
            <img src={logo} alt="TTM Novels Logo" className={styles.logo} title="Click to browse novels" />
          </div>
        </div>

        {/* Center Section: Language Selector & Search Bar */}
        <div className={styles.centerSection}>
          {/* Language Selector */}
          <div className={styles.languageSelector} ref={languageDropdownRef}>
            <button
              type="button"
              className={styles.languageButton}
              onClick={toggleLanguageDropdown}
              aria-label="Select language"
              aria-expanded={isLanguageDropdownOpen}
            >
              <svg
                className={styles.languageIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span className={styles.languageText}>{language === 'tamil' ? 'தமிழ்' : 'English'}</span>
              <svg
                className={`${styles.dropdownArrow} ${isLanguageDropdownOpen ? styles.open : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {/* Language Dropdown */}
            {isLanguageDropdownOpen && (
              <div className={styles.languageDropdown} role="menu">
                <button
                  type="button"
                  className={`${styles.languageOption} ${language === 'tamil' ? styles.active : ''}`}
                  onClick={() => handleLanguageChange('tamil')}
                  role="menuitem"
                >
                  <span>தமிழ்</span>
                  <span className={styles.languageLabel}>Tamil</span>
                </button>
                <button
                  type="button"
                  className={`${styles.languageOption} ${language === 'english' ? styles.active : ''}`}
                  onClick={() => handleLanguageChange('english')}
                  role="menuitem"
                >
                  <span>English</span>
                </button>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.searchContainer}>
              <svg
                className={styles.searchIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder={t.header.search}
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Theme Toggle Button */}
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <svg
                className={styles.themeIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg
                className={styles.themeIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </div>

        {/* Right Section: Notification & User Login Icons */}
        <div className={styles.rightSection}>
          {/* Notification Icon */}
          <button
            className={styles.notificationIcon}
            aria-label="Notifications"
            title="Notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>

          {/* User Login Icon */}
          <button
            className={styles.userLoginIcon}
            onClick={onLoginClick}
            aria-label="User Login"
            title="User Login"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.nav}>
            <a href="/" className={styles.navLink}>
              <svg
                className={styles.navIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>{t.header.home}</span>
            </a>
            <a href="/contact" className={styles.navLink}>
              <svg
                className={styles.navIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <span>{t.header.contact}</span>
            </a>
            <a href="/about" className={styles.navLink}>
              <svg
                className={styles.navIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              <span>{t.header.about}</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
