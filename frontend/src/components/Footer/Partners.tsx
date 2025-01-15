import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchHomePageContent } from '../../services/api';

const Partners = () => {
  const [partners, setPartners] = useState([]);

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
          <a
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center transition"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_INDEX_URL}${partner.logo}`}
              alt={partner.name}
              width={200} // Zvýšena šířka loga
              height={200} // Zvýšena výška loga
              className="object-contain transition transform hover:scale-105"
            />
            <span className="text-center text-lg font-medium text-white">{partner.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Partners;
