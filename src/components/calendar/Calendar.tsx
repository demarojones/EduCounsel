import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const Calendar: React.FC = () => {
  const { interactions } = useAppContext();
  const navigate = useNavigate();
  
  // Convert interactions to calendar events
  const events = interactions.map(interaction => ({
    id: interaction.id,
    title: `${interaction.personName} - ${interaction.type}`,
    start: `${interaction.date}T${interaction.startTime}`,
    end: `${interaction.date}T${interaction.endTime}`,
    backgroundColor: interaction.type === 'Student' ? '#4F46E5' : '#2563EB',
    borderColor: interaction.type === 'Student' ? '#4338CA' : '#1E40AF',
    extendedProps: {
      type: interaction.type,
      personName: interaction.personName,
      followUpNeeded: interaction.followUpNeeded
    }
  }));

  const handleEventClick = (info: any) => {
    navigate(`/interactions/${info.event.id}?from=calendar`);
  };

  const handleDateSelect = (selectInfo: any) => {
    const startTime = selectInfo.startStr.split('T')[1]?.substring(0, 5) || '09:00';
    const endTime = selectInfo.endStr.split('T')[1]?.substring(0, 5) || '09:30';
    const date = selectInfo.startStr.split('T')[0];

    navigate(`/interactions/new?date=${date}&startTime=${startTime}&endTime=${endTime}&from=calendar`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            eventClick={handleEventClick}
            selectable={true}
            select={handleDateSelect}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            slotMinTime="07:00:00"
            slotMaxTime="18:00:00"
            allDaySlot={false}
            height="auto"
            eventContent={(eventInfo) => {
              const event = eventInfo.event;
              return (
                <div className="p-1 text-xs">
                  <div className="font-semibold">{event.extendedProps.personName}</div>
                  <div>{event.extendedProps.type}</div>
                  {event.extendedProps.followUpNeeded && (
                    <div className="mt-1 text-amber-100">Follow-up needed</div>
                  )}
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;