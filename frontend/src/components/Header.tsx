// components/Header.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Headroom from 'react-headroom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (pathname: string) => router.pathname === pathname;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Headroom>
      <header className={`bg-gradient-to-b from-black via-black to-[#251f68] text-white fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'h-15' : 'h-77'}`}>
        <div className={`container mx-auto transition-all duration-300 ${scrolled ? 'py-2 flex flex-row items-center justify-between' : 'py-6 flex flex-col items-center'}`}>
          <div className={`flex ${scrolled ? 'items-center' : 'flex-col items-center'}`}>
            <Image priority src="/logo.webp" alt="Logo" width={scrolled ? 48 : 160} height={scrolled ? 48 : 160} className={`transition-all duration-300 ${scrolled ? 'mr-4' : 'mb-1 mt-1'}`} />
            <div className={`text-white ${scrolled ? 'text-2xl' : 'text-5xl'} font-bold uppercase transition-all duration-300`}>
              <Link href="/">Superpařmeni</Link>
            </div>
          </div>
            {!scrolled && <div className="text-2xl mb-2 transition-all duration-300">...od Hráčů, pro Hráče...</div>}
            <nav className={`flex space-x-4 ${scrolled ? 'hidden lg:flex' : 'flex'} overflow-x-auto transition-all duration-300 whitespace-nowrap`}>
            <Link href="/" passHref legacyBehavior>
              <a className={`nav-link ${isActive('/') ? 'active' : ''}`}>Domů</a>
            </Link>
            <Link href="/blog" passHref legacyBehavior>
              <a className={`nav-link ${isActive('/blog') ? 'active' : ''}`}>Články</a>
            </Link>
            <Link href="/reviews" passHref legacyBehavior>
              <a className={`nav-link ${isActive('/reviews') ? 'active' : ''}`}>Recenze</a>
            </Link>
            <Link href="/esport" passHref legacyBehavior>
              <a className={`nav-link ${isActive('/esport') ? 'active' : ''}`}>E-Sport</a>
            </Link>
            <Link href="/games" passHref legacyBehavior>
              <a className={`nav-link ${isActive('/games') ? 'active' : ''}`}>Databáze her</a>
            </Link>
            <Link href="/calendar" passHref legacyBehavior>
              <a className={`nav-link ${isActive('/calendar') ? 'active' : ''}`}>Herní kalendář</a>
            </Link>
            {/* <Link href="/eshop" passHref legacyBehavior>
              <a className={`nav-link ${isActive('/eshop') ? 'active' : ''}`}>Eshop</a>
            </Link> */}
            </nav>
          {scrolled && (
            <button onClick={toggleMenu} className="text-white lg:hidden">
              {menuOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
            </button>
          )}
        </div>
        {menuOpen && scrolled && (
          <nav className="absolute top-full left-0 w-full bg-[#251f68] p-4 lg:hidden">
            <Link href="/" passHref legacyBehavior>
              <a className={`block py-2 ${isActive('/') ? 'active' : ''}`}>Domů</a>
            </Link>
            <Link href="/blog" passHref legacyBehavior>
              <a className={`block py-2 ${isActive('/blog') ? 'active' : ''}`}>Články</a>
            </Link>
            <Link href="/reviews" passHref legacyBehavior>
              <a className={`block py-2 ${isActive('/reviews') ? 'active' : ''}`}>Recenze</a>
            </Link>
            <Link href="/esport" passHref legacyBehavior>
              <a className={`block py-2 ${isActive('/esport') ? 'active' : ''}`}>E-Sport</a>
            </Link>
            <Link href="/games" passHref legacyBehavior>
              <a className={`block py-2 ${isActive('/games') ? 'active' : ''}`}>Databáze her</a>
            </Link>
            <Link href="/calendar" passHref legacyBehavior>
              <a className={`nav-link ${isActive('/calendar') ? 'active' : ''}`}>Herní kalendář</a>
            </Link>
            {/* <Link href="/eshop" passHref legacyBehavior>
              <a className={`block py-2 ${isActive('/eshop') ? 'active' : ''}`}>Eshop</a>
            </Link> */}
          </nav>
        )}
      </header>
      <style jsx>{`
        .nav-link {
          border-bottom: 4px solid transparent;
          transition: border-color 0.3s ease;
        }
        .nav-link:hover,
        .nav-link.active {
          border-bottom: 4px solid #8e67ea;
        }
        @media (max-width: 1024px) {
          nav {
            position: absolute;
            top: 90%;
            left: 0;
            width: 100%;
            background: #251f68;
            padding: 1rem;
          }
        }
      `}</style>
    </Headroom>
  );
};

export default Header;
