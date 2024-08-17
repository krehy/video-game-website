import React, { useState, useEffect } from 'react';
import { fetchInstagramPhotos } from '../services/instagram';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const InstagramPhotos = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getPhotos = async () => {
      const instagramPhotos = await fetchInstagramPhotos();
      setPhotos(instagramPhotos);
    };
    getPhotos();
  }, []);

  const openModal = (photo: any) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setIsModalOpen(false);
  };

  return (
    <div className="instagram-photos">
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'black' }}>Náš Instagram:</h3>
      <ul className="space-y-2 grid grid-cols-2 gap-4">
        {photos.length > 0 ? (
          photos.map(photo => (
            <li key={photo.id} className="cursor-pointer" onClick={() => openModal(photo)}>
              <img src={photo.thumbnail_url || photo.media_url} alt={photo.caption} className="rounded-lg shadow-md" />
            </li>
          ))
        ) : (
          <li className="text-gray-600">Žádné fotky k zobrazení.</li>
        )}
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
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            {selectedPhoto && (
              <div className="instagram-photo-modal-content">
                <img src={selectedPhoto.media_url} alt={selectedPhoto.caption} className="rounded-lg shadow-md w-full" />
                {selectedPhoto.caption && <p className="mt-4">{selectedPhoto.caption}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramPhotos;
