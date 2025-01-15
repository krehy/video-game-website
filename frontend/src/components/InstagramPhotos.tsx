import React, { useState, useEffect } from 'react';
import { fetchInstagramPhotos } from '../services/instagram';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faSearch, faTimes as faClose } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { motion } from 'framer-motion';

const InstagramPhotos = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [reels, setReels] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getInstagramData = async () => {
      const { photos, reels } = await fetchInstagramPhotos();
      setPhotos(photos);
      setReels(reels);
    };
    getInstagramData();
  }, []);

  const openModal = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const highlightHashtags = (text: string) => {
    if (!text) return null;
    const hashtagRegex = /#\w+/g;
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) =>
      hashtagRegex.test(part) ? (
        <span key={index} className="text-[#8e67ea] font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="instagram-photos">
      <h3 className="text-lg font-semibold mb-4 flex items-center text-black">
        <a
          target="__blank"
          href="https://www.instagram.com/superparmeni"
          className="mr-2"
        >
          <FontAwesomeIcon icon={faInstagram} size="lg" style={{ color: '#8e67ea' }} />
        </a>
        Novinky z IG
      </h3>
      <ul className="grid grid-cols-2 gap-4 mb-8">
        {photos.map((photo) => (
          <motion.li
            key={photo.id}
            className="cursor-pointer relative group"
            whileHover={{ scale: 1.05 }}
            onClick={() => openModal(photo)}
          >
            <Image
              src={photo.thumbnail_url || photo.media_url}
              alt={photo.caption}
              width={300}
              height={300}
              layout="responsive"
              className="rounded-lg shadow-md"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
              <FontAwesomeIcon icon={faSearch} size="2x" className="text-white" />
            </div>
          </motion.li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold mb-4 flex items-center text-black">
        <FontAwesomeIcon icon={faInstagram} size="lg" style={{ color: '#8e67ea' }} className="mr-2" />
        Naše Reelska
      </h3>
      <ul className="grid grid-cols-2 gap-4">
        {reels.map((reel) => (
          <motion.li
            key={reel.id}
            className="cursor-pointer relative group"
            whileHover={{ scale: 1.05 }}
            onClick={() => openModal(reel)}
          >
            <Image
              src={reel.thumbnail_url || reel.media_url}
              alt={reel.caption}
              width={300}
              height={300}
              layout="responsive"
              className="rounded-lg shadow-md"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
              <FontAwesomeIcon icon={faSearch} size="2x" className="text-white" />
            </div>
          </motion.li>
        ))}
      </ul>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-2 right-2 text-gray-600" onClick={closeModal}>
              <FontAwesomeIcon icon={faClose} size="lg" />
            </button>
            {selectedItem && (
              <div className="instagram-photo-modal-content">
                {selectedItem.media_type === 'VIDEO' ? (
                  <video
                    src={selectedItem.media_url}
                    controls
                    className="rounded-lg shadow-md w-full max-h-[500px]"
                    disablePictureInPicture
                    controlsList="nodownload noplaybackrate nofullscreen"
                  />
                ) : (
                  <Image
                    src={selectedItem.media_url}
                    alt={selectedItem.caption}
                    width={800}
                    height={800}
                    layout="responsive"
                    className="rounded-lg shadow-md w-full"
                  />
                )}
                {selectedItem.caption && (
                  <p className="mt-4 text-black">{highlightHashtags(selectedItem.caption)}</p>
                )}
                <div className="mt-4 text-center">
                  <a
                    href="https://www.instagram.com/superparmeni"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#8e67ea] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#764bb5] transition"
                  >
                    Navštívit náš Instagram
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramPhotos;
