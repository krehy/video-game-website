import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";

const YouTubeSubscribe = () => {
  return (
    <div className="flex flex-col items-center mt-6">
      <h3 className="text-xl font-semibold mb-2">Odebírej náš YouTube kanál</h3>
      <Link
        href="https://www.youtube.com/channel/UCAxFYTXmltayP7Th42WReyA?sub_confirmation=1"
        target="_blank"
      >
        <button className="bg-red-600 px-6 py-3 rounded-lg text-white flex items-center gap-2 text-lg hover:bg-red-700 transition">
          <FontAwesomeIcon icon={faYoutube} className="text-white text-2xl" />
          Odebírat na YouTube
        </button>
      </Link>
    </div>
  );
};

export default YouTubeSubscribe;
