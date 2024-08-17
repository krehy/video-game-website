import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import dayjs from 'dayjs';
import DarkModeToggle from './DarkModeToggle';
import csLocale from '@fullcalendar/core/locales/cs';
import { fetchGames } from '../../services/api';
import GameDetailModal from './GameDetailModal';

const GameCalendar = () => {
    const [games, setGames] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Added loading state
    const calendarRef = useRef(null); // Ref to access the calendar API

    useEffect(() => {
        const loadGames = async () => {
            try {
                const gameData = await fetchGames();
                setGames(gameData);
                setIsLoading(false);  // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };

        loadGames();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (calendarRef.current) {
                const calendarApi = calendarRef.current.getApi();
                calendarApi.render();  // Re-render the calendar on window resize
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleEventClick = (info) => {
        info.jsEvent.preventDefault();
        const game = games.find(g => g.url_path === info.event.url);
        setSelectedGame(game);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedGame(null);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const game = games.find(g => g.title.toLowerCase() === query.toLowerCase());
        if (game) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(game.release_date); // Go to the release date of the game
            calendarApi.changeView('dayGridDay'); // Switch to day view
            setSelectedGame(game); // Optionally open the modal with game details
            setIsModalOpen(true); // Open the modal automatically if a match is found
        }
    };

    const events = games
        .filter(game => {
            const today = dayjs();
            const releaseDate = dayjs(game.release_date);
            return releaseDate.isBefore(today) || releaseDate.isSame(today) || releaseDate.isAfter(today);
        })
        .map(game => ({
            title: game.title,
            start: game.release_date,
            url: game.url_path,
        }));

    return (
        <div className={isDarkMode ? 'dark bg-transparent text-white' : 'bg-white text-black'}>
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <div className="mb-4 flex justify-center">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Vyhledat hru podle názvu"
                    className="p-2 border rounded w-2/3 text-black"
                    style={{ borderColor: '#8e67ea', marginTop: '20px' }} // Black text for input
                />
            </div>
            {isLoading ? (
                <div className="loading-spinner">Loading...</div> // Display a loading spinner or message
            ) : (
                <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-transparent' : 'bg-white'}`}>
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        locale={csLocale}
                        eventClick={handleEventClick}
                        eventColor="#8e67ea"  // Set event color to #8e67ea
                        eventTextColor="white" // Set event text color to white
                        dayCellClassNames="custom-border"
                        dayHeaderClassNames="bg-customPurple text-white"
                        headerToolbar={{
                            start: 'prev,next today',
                            center: 'title',
                            end: 'dayGridMonth,dayGridWeek,dayGridDay',
                        }}
                        headerToolbarClassNames="bg-customDark text-white p-2 rounded-lg"
                        buttonClassNames="custom-button px-4 py-2 rounded-lg mx-1"
                        className="custom-calendar"
                        dayCellDidMount={(info) => {
                            if (info.isToday) {
                                info.el.classList.add('highlight-today');
                            }
                        }}
                    />
                </div>
            )}
            <GameDetailModal
                isOpen={isModalOpen}
                onClose={closeModal}
                game={selectedGame}
            />
            <style jsx>{`
                .custom-border {
                    border-color: #8e67ea !important;
                }

                .custom-calendar .fc-scrollgrid {
                    border-color: #8e67ea !important;
                }

                .custom-calendar .fc-scrollgrid td,
                .custom-calendar .fc-scrollgrid th {
                    border-color: #8e67ea !important;
                }

                .highlight-today {
                    background-color: rgba(142, 103, 234, 0.3) !important;
                    border-color: #8e67ea !important;
                }

                .custom-button {
                    background-color: #251f68 !important;
                    color: white !important;
                }

                .custom-button:hover {
                    background-color: #3c358f !important;
                }
            `}</style>
        </div>
    );
};

export default GameCalendar;
