import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import dayjs from 'dayjs';
import csLocale from '@fullcalendar/core/locales/cs';
import { fetchGames } from '../../services/api';
import GameDetailModal from './GameDetailModal';
import { Game } from '../../types';

const GameCalendar = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const calendarRef = useRef<FullCalendar>(null);

    useEffect(() => {
        const loadGames = async () => {
            try {
                const gameData = await fetchGames();
                setGames(gameData);
                setIsLoading(false);
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
                calendarApi.updateSize();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleEventClick = (info: EventClickArg) => {
        info.jsEvent.preventDefault();
        const game = games.find(g => g.url_path === info.event.url);
        setSelectedGame(game || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedGame(null);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        const game = games.find(g => g.title.toLowerCase() === query.toLowerCase());
        if (game) {
            const calendarApi = calendarRef.current?.getApi();
            if (calendarApi) {
                calendarApi.gotoDate(game.release_date);
                calendarApi.changeView('dayGridDay');
            }
            setSelectedGame(game);
            setIsModalOpen(true);
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
        <div className="container dark">
            <div className="mb-4 flex justify-center">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Vyhledat hru podle názvu"
                    className="p-2 border rounded w-2/3 text-black"
                    style={{ borderColor: '#8e67ea', marginTop: '20px' }}
                />
            </div>
            {isLoading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <div className="calendar-container p-6 rounded-lg shadow-lg bg-transparent">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        locale={csLocale}
                        eventClick={handleEventClick}
                        eventColor="#8e67ea"
                        eventTextColor="white"
                        dayCellClassNames="custom-border"
                        dayHeaderClassNames="bg-customPurple text-white"
                        headerToolbar={{
                            start: 'prev,next today',
                            center: 'title',
                            end: 'dayGridMonth,dayGridWeek,dayGridDay',
                        }}
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

                .fc-toolbar {
                    background-color: #251f68;
                    color: white;
                    padding: 10px;
                    border-radius: 8px;
                    display: flex;
                    flex-wrap: wrap;
                }

                .fc-button {
                    background-color: #251f68;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    margin: 0 5px;
                    white-space: nowrap;
                }

                .fc-button:hover {
                    background-color: #3c358f;
                }

                .calendar-container {
                    overflow-x: auto;
                }

                @media (max-width: 768px) {
                    .fc-toolbar {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .fc-button-group {
                        display: flex;
                        justify-content: center;
                        margin-bottom: 10px;
                    }

                    .fc-button {
                        flex: 1;
                        margin: 5px 0;
                    }

                    .fc-toolbar-title {
                        margin-bottom: 10px;
                        text-align: center;
                    }

                    .calendar-container {
                        padding: 10px;
                    }
                }

                .loading-spinner {
                    text-align: center;
                    font-size: 1.5em;
                    margin-top: 20px;
                }

                .fc-col-header-cell-cushion,
                .fc-daygrid-day-number {
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default GameCalendar;
