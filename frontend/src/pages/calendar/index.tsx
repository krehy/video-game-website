import React from 'react';
import GameCalendar from '../../components/CalendarPage/GameCalendar';

const CalendarPage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Herní kalendář</h1>
            <GameCalendar />
        </div>
    );
};

export default CalendarPage;
