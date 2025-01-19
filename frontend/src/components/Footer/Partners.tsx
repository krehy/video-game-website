import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchHomePageContent } from '../../services/api';

// Typ pro jednoho partnera
interface Partner {
  name: string;
  url: string;
  logo: string;
}

const Partners: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await fetchHomePageContent();
        setPartners(data.partners || []);
      } catch (error) {
        console.error('Chyba při načítání partnerů:', error);
      }
    };

    fetchPartners();
  }, []);

  if (partners.length === 0) {
    return null; // Pokud nejsou žádní partneři, komponenta se nezobrazí
  }

  return (
    <div className="bg-transparent py-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Naši Partneři</h2>
      <div className="flex justify-center items-center flex-wrap gap-8">
        {partners.map((partner) => (
          <Link
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center transition"
          >
<Image
  src={`${process.env.NEXT_PUBLIC_INDEX_URL}${partner.logo}`}
  alt={partner.name}
  width={200}
  height={200}
  style={{ height: 'auto', width: '100%' }} // Zachování poměru stran
  className="object-contain transition transform hover:scale-105"
/>
            <span className="text-center text-lg font-medium text-white mt-2">{partner.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Partners;
