export const fetchLiveEsportsMatches = async (): Promise<any> => {
    try {
      const response = await fetch('https://superparmeni.eu/api/esport/matches/live/');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("❌ Chyba při získávání live esport zápasů:", error);
      return [];
    }
  };
  
  export const fetchRecentEsportsResults = async (): Promise<any> => {
    try {
      const response = await fetch('https://superparmeni.eu/api/esport/matches/results/');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("❌ Chyba při získávání minulých esport zápasů:", error);
      return [];
    }
  };
  