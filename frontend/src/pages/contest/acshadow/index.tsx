import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faInstagram, faTwitch } from "@fortawesome/free-brands-svg-icons";

const questions = [
  {
    question: "Kdo byl hlavním hrdinou Assassin’s Creed II?",
    answers: ["Altair", "Ezio", "Connor", "Edward"],
    correct: 1,
  },
  {
    question: "Ve kterém roce vyšel první Assassin’s Creed?",
    answers: ["2005", "2007", "2009", "2011"],
    correct: 1,
  },
  {
    question: "Jak se jmenuje tajná organizace proti Assassinům?",
    answers: ["Rytíři kulatého stolu", "Templáři", "Vikingové", "Řád svatého Jana"],
    correct: 1,
  },
];

const ContestPage = () => {
  const [step, setStep] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [isFormValid, setIsFormValid] = useState(false);
  const [socialFollowed, setSocialFollowed] = useState({
    youtube: false,
    instagram: false,
    twitch: false,
  });
  const handleSocialClick = (platform: "youtube" | "instagram" | "twitch") => {
    setSocialFollowed((prev) => ({ ...prev, [platform]: true }));
  };
  const allSocialsFollowed = Object.values(socialFollowed).every(Boolean);
  


  useEffect(() => {
    setIsFormValid(userData.name.trim() !== "" && userData.email.trim() !== "");
  }, [userData]);

  const correctAnswers = selectedAnswers.filter(
    (answer, index) => answer === questions[index].correct
  ).length;

  const handleAnswerClick = (index: number) => {
    const newAnswers = [...selectedAnswers, index];
    setSelectedAnswers(newAnswers);

    if (step < 1 + questions.length) {
      setStep(step + 1);
    } else {
      setStep(2 + questions.length);
    }
  };

  const handleSubmit = async () => {
    if (!allSocialsFollowed) return;

    try {
      const payload = {
        name: userData.name.trim(),
        email: userData.email.trim(),
        phone: userData.phone.trim() || null,
        answers: selectedAnswers.length > 0 ? selectedAnswers : [],
      };

      console.log("Odesílám:", payload);

      const response = await axios.post("https://superparmeni.eu/api/contest/", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        alert("Úspěšně odesláno!");
        setStep(step + 1); // Přesun na další krok (děkovná stránka)
      }
    } catch (error) {
      console.error("Chyba při odesílání:", (error as any).response?.data || error);
      alert("Nastala chyba při odesílání.");
    }
};

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

useEffect(() => {
  setIsFormValid(
    userData.name.trim() !== "" &&
    isValidEmail(userData.email.trim()) // Ověření emailu
  );
}, [userData]);

    
  return (
    <div className="container mx-auto p-6 text-white text-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        
        {/* Úvodní slide */}
        {step === 1 && (
          <div>
            <Image src="/acshadows.jpg" alt="Assassin's Creed Shadows" width={600} height={300} className="mx-auto rounded-lg shadow-lg" />
            <h1 className="text-4xl font-bold mt-6">Vyhraj Assassin’s Creed Shadows!</h1>
            <p className="mt-4 text-lg">
              Připrav se na novou kapitolu v sérii Assassin’s Creed! <strong>Assassin’s Creed Shadows</strong> tě zavede do feudálního Japonska, kde budeš bojovat jako mistrný shinobi.  
            </p>
            <p className="mt-4 text-lg">
              Otestuj své znalosti a zapoj se do soutěže! Stačí odpovědět na kvíz a sledovat nás na sociálních sítích. 🎮🔥
            </p>
            <button onClick={() => setStep(2)} className="mt-6 bg-red-600 px-6 py-3 text-lg rounded-lg">
              Začít kvíz
            </button>
          </div>
        )}

        {/* Kvíz */}
        {step >= 2 && step < 2 + questions.length && (
          <div>
            <Image src="/acshadows.jpg" alt="AC Shadows" width={500} height={200} className="mx-auto mb-4 rounded-lg shadow-md" />
            <h2 className="text-2xl font-bold">{questions[step - 2].question}</h2>
            <div className="flex flex-col mt-4 space-y-3">
              {questions[step - 2].answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-300"
                >
                  {answer}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm">Otázka {step - 1} / {questions.length}</p>
          </div>
        )}

        {/* Formulář pro sběr údajů */}
        {step === 2 + questions.length && (
          <div>
            <Image src="/acshadows.jpg" alt="AC Shadows" width={500} height={200} className="mx-auto mb-4 rounded-lg shadow-md" />
            <h2 className="text-2xl font-bold">Zadej své údaje pro účast</h2>
            <p className="mt-2 text-lg">Máš {correctAnswers} z {questions.length} správně!</p>
            <div className="flex flex-col gap-4 mt-4">
              <input type="text" placeholder="Jméno" value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} className="p-2 rounded-lg bg-gray-700 text-white" />
              <input 
  type="email" 
  placeholder="Email" 
  value={userData.email} 
  onChange={(e) => setUserData({ ...userData, email: e.target.value })} 
  className={`p-2 rounded-lg text-white ${
    isValidEmail(userData.email) ? "bg-gray-700" : "bg-gray-700"
  }`} 
/>
              <input type="tel" placeholder="Telefon (nepovinné)" value={userData.phone} onChange={(e) => setUserData({ ...userData, phone: e.target.value })} className="p-2 rounded-lg bg-gray-700 text-white" />
            </div>
            <button 
  onClick={() => isFormValid && setStep(step + 1)}
  disabled={!isFormValid}
  className={`mt-6 px-6 py-3 rounded-lg ${
    isFormValid ? "bg-blue-600" : "bg-gray-500 cursor-not-allowed"
  }`}
>
  Pokračovat na sociální sítě
</button>
          </div>
        )}

        {/* Ověření sociálních sítí */}
        {step === 3 + selectedAnswers.length && (
        <div>
          <Image
            src="/acshadows.jpg"
            alt="AC Shadows"
            width={500}
            height={200}
            className="mx-auto mb-4 rounded-lg shadow-md"
          />
          <h2 className="text-2xl font-bold mb-4">
            Sleduj nás na sociálních sítích
          </h2>

{/* Sociální sítě */}
<div className="flex flex-col items-center gap-6">
  
  {/* Instagram Button */}
  <Link
    href="https://www.instagram.com/superparmeni/"
    target="_blank"
    onClick={() => handleSocialClick("instagram")}
  >
    <button className="bg-pink-600 px-6 py-3 rounded-lg text-white flex items-center gap-2 text-lg hover:bg-pink-700 transition">
      <FontAwesomeIcon icon={faInstagram} className="text-white text-2xl" />
      Sleduj nás na Instagramu
    </button>
  </Link>

  {/* YouTube Subscribe */}
  <h3 className="text-xl font-semibold mt-4">Odebírej náš YouTube kanál</h3>
  <Link
    href="https://www.youtube.com/channel/UCAxFYTXmltayP7Th42WReyA?sub_confirmation=1"
    target="_blank"
    onClick={() => handleSocialClick("youtube")}
  >
    <button className="bg-red-600 px-6 py-3 rounded-lg text-white flex items-center gap-2 text-lg hover:bg-red-700 transition">
      <FontAwesomeIcon icon={faYoutube} className="text-white text-2xl" />
      Odebírat na YouTube
    </button>
  </Link>

  {/* Twitch Follow */}
  <h3 className="text-xl font-semibold mt-4">Sleduj nás na Twitchi</h3>
  <Link
    href="https://www.twitch.tv/superparmeni"
    target="_blank"
    onClick={() => handleSocialClick("twitch")}
  >
    <button className="bg-purple-600 px-6 py-3 rounded-lg text-white flex items-center gap-2 text-lg hover:bg-purple-700 transition">
      <FontAwesomeIcon icon={faTwitch} className="text-white text-2xl" />
      Sleduj nás na Twitchi
    </button>
  </Link>
</div>


          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!allSocialsFollowed}
            className={`mt-6 px-6 py-3 rounded-lg ${
              allSocialsFollowed ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            Odeslat odpovědi
          </button>
        </div>
      )}
      {/* Poděkování za účast */}
{step === 4 + questions.length && (
  <div>
    <Image src="/acshadows.jpg" alt="AC Shadows" width={500} height={200} className="mx-auto mb-4 rounded-lg shadow-md" />
    <h2 className="text-3xl font-bold">Děkujeme za účast v soutěži!</h2>
    <p className="mt-4 text-lg">
      Tvůj formulář byl úspěšně odeslán. 🎉 Držíme ti palce!
    </p>
    <p className="mt-2 text-lg font-semibold">
      Výsledky budou vyhlášeny <span className="text-yellow-400">16. března 2025</span>.
    </p>
    <p className="mt-4 text-sm text-gray-300">
      Sleduj naše sociální sítě, ať ti nic neunikne!
    </p>
    <Link href="/" className="mt-6 bg-blue-600 px-6 py-3 text-lg rounded-lg inline-block hover:bg-blue-700 transition">
      Zpět na hlavní stránku
    </Link>
  </div>
)}

      </motion.div>
    </div>
  );
};

export default ContestPage;
