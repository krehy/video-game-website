import React, { useState } from 'react';
import { submitContactMessage } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface CooperationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CooperationModal: React.FC<CooperationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    message_type: 'cooperation',
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const messageData = {
      message_type: 'cooperation',
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };

    try {
      const response = await submitContactMessage(messageData);
      console.log('Zpráva úspěšně odeslána:', response);
      onClose(); // Zavřít modal po odeslání
    } catch (error) {
      console.error('Chyba při odesílání zprávy:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}  // Zavřít modal při kliknutí mimo něj
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}  // Zabránit zavření modalu při kliknutí dovnitř
      >
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#8e67ea' }}>Spolupráce</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Jméno</label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              value={formData.name}
              className="mt-1 block w-full p-2 border rounded"
              style={{ borderColor: '#8e67ea', color: 'black' }}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className="mt-1 block w-full p-2 border rounded"
              style={{ borderColor: '#8e67ea', color: 'black' }}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Zpráva</label>
            <textarea
              id="message"
              name="message"
              onChange={handleChange}
              value={formData.message}
              className="mt-1 block w-full p-2 border rounded"
              style={{ borderColor: '#8e67ea', color: 'black' }}
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded"
              style={{ backgroundColor: '#8e67ea', color: 'white' }}
            >
              Odeslat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CooperationModal;
