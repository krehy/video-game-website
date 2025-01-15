import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTiktok, faDiscord, faTwitch } from '@fortawesome/free-brands-svg-icons';
import { faHandshake, faWrench, faQuestionCircle, faLock } from '@fortawesome/free-solid-svg-icons';
import CooperationModal from './Footer/CooperationModal';
import ReportProblemModal from './Footer/ReportProblemModal';
import OtherInquiryModal from './Footer/OtherInquiryModal';
import PrivacyPolicyModal from './Footer/PrivacyPolicyModal';
import { fetchHomePageContent } from '../services/api';

interface Partner {
  name: string;
  logo: string;
  url: string;
}

interface Settings {
  secondaryColor?: string;
  about_us?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  discordInvite?: string;
  footer_text?: string;
  privacy_policy?: string;
  partners?: Partner[];
}

const Footer = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [showCooperationModal, setShowCooperationModal] = useState(false);
  const [showReportProblemModal, setShowReportProblemModal] = useState(false);
  const [showOtherInquiryModal, setShowOtherInquiryModal] = useState(false);
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await fetchHomePageContent();
      setSettings(data);
    } catch (error) {
      console.error('Chyba při načítání obsahu z HomePage:', error);
    }
  };

  const highlightColor = settings.secondaryColor || "#8e67ea";

  return (
    <div>

      <div className="bg-gradient-to-t from-black to-gray-800 h-20" style={{ background: 'linear-gradient(to top, black, #251f68)', height: '100px' }}></div>
      <footer className="bg-black text-white py-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-16 text-center md:text-left">
          <div className="w-full md:w-1/3">
            <h2 className="text-xl font-bold mb-4" style={{ color: highlightColor }}>O nás</h2>
            <div dangerouslySetInnerHTML={{ __html: settings.about_us || 'Jsme tým vášnivých hráčů, kteří se zaměřují na poskytování nejnovějších novinek a recenzí na technologie, hry a další.' }} />
          </div>
          <div className="w-full md:w-1/3">
            <h2 className="text-xl font-bold mb-4" style={{ color: highlightColor }}>Kontakt</h2>
            <ul>
              <li className="mb-2">
                <a href="#spoluprace" className="hover:underline hover:opacity-80 transition duration-300" onClick={() => setShowCooperationModal(true)}>
                  <FontAwesomeIcon icon={faHandshake} className="mr-2" style={{ color: highlightColor }} />
                  Spolupráce
                </a>
              </li>
              <li className="mb-2">
                <a href="#nahlasit-problem" className="hover:underline hover:opacity-80 transition duration-300" onClick={() => setShowReportProblemModal(true)}>
                  <FontAwesomeIcon icon={faWrench} className="mr-2" style={{ color: highlightColor }} />
                  Nahlásit problém
                </a>
              </li>
              <li className="mb-2">
                <a href="#jiny-dotaz" className="hover:underline hover:opacity-80 transition duration-300" onClick={() => setShowOtherInquiryModal(true)}>
                  <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" style={{ color: highlightColor }} />
                  Jiný dotaz
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h2 className="text-xl font-bold mb-4" style={{ color: highlightColor }}>Sleduj nás</h2>
            <div className="flex justify-center md:justify-start space-x-4">
              <a target='__blank' title='Instagram' href={settings.instagramUrl || "https://instagram.com/superparmeni"} className="text-white hover:text-highlight transition duration-300">
                <FontAwesomeIcon icon={faInstagram} size="2x" style={{ color: 'white' }} />
              </a>
              <a target='__blank' title='Facebook' href={settings.facebookUrl || "https://facebook.com/superparmeni"} className="text-white hover:text-highlight transition duration-300">
                <FontAwesomeIcon icon={faFacebook} size="2x" style={{ color: 'white' }} />
              </a>
              <a target='__blank' title='TikTok' href={settings.tiktokUrl || "https://tiktok.com/@superparmeni"} className="text-white hover:text-highlight transition duration-300">
                <FontAwesomeIcon icon={faTiktok} size="2x" style={{ color: 'white' }} />
              </a>
              <a target='__blank' title='Twitch' href={"https://www.twitch.tv/superparmeni"} className="text-white hover:text-highlight transition duration-300">
                <FontAwesomeIcon icon={faTwitch} size="2x" style={{ color: 'white' }} />
              </a>
              <a target='__blank' title='Discord' href={settings.discordInvite || "https://discord.com/invite/jDEVpHR9Wq"} className="text-white hover:text-highlight transition duration-300">
                <FontAwesomeIcon icon={faDiscord} size="2x" style={{ color: 'white' }} />
              </a>
            </div>
            <div className="mt-4">
              <a href="#zasady-ochrany-osobnich-udaju" className="text-sm hover:underline hover:opacity-80 transition duration-300" onClick={() => setShowPrivacyPolicyModal(true)}>
                <FontAwesomeIcon icon={faLock} className="mr-2" style={{ color: highlightColor }} />
                Zásady ochrany osobních údajů
              </a>
            </div>
          </div>
        </div>
        <div className="container mx-auto text-center border-t border-gray-700 pt-4 mt-4">
          <div dangerouslySetInnerHTML={{ __html: settings.footer_text || '© 2024 Všechna práva vyhrazena. Vytvořeno s ❤️ týmem @superparmeni.eu' }} />
        </div>
      </footer>

      {/* Modals */}
      <CooperationModal isOpen={showCooperationModal} onClose={() => setShowCooperationModal(false)} />
      <ReportProblemModal isOpen={showReportProblemModal} onClose={() => setShowReportProblemModal(false)} />
      <OtherInquiryModal isOpen={showOtherInquiryModal} onClose={() => setShowOtherInquiryModal(false)} />
      <PrivacyPolicyModal
        isOpen={showPrivacyPolicyModal}
        onClose={() => setShowPrivacyPolicyModal(false)}
        content={settings.privacy_policy || ""} // Použití výchozí hodnoty, pokud je undefined
      />
    </div>
  );
};

export default Footer;