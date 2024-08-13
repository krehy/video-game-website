import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const PrivacyPolicyModal = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}  // Zavřít modal při kliknutí mimo něj
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}  // Zabránit zavření modalu při kliknutí dovnitř
      >
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#8e67ea' }}>Zásady ochrany osobních údajů</h2>
        <div className="prose" style={{ color: 'black' }} dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
