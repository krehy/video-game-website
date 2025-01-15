import React from 'react';
import GameCalendar from '../../components/CalendarPage/GameCalendar';
import TwitchStream from '@/components/TwitchStream';

const CalendarPage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 style={{color:'white'}} className="text-3xl font-bold mb-4">Herní kalendář</h1>
            <GameCalendar />
            <TwitchStream />

        </div>
    );
};

export default CalendarPage;
