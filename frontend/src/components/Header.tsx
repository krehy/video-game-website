// components/Header.js
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link href="/">Video Game Website</Link>
        </div>
        <div className="space-x-4">
          <Link href="/">Domů</Link>
          <Link href="/blog">Články</Link>
          <Link href="/reviews">Recenze</Link>
          <Link href="/games">Databáze her</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
