// Event.js
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import event1 from '../../assets/images/event1.jpg'
function Event() {
    const navigate = useNavigate();
    const location = useLocation();
    const url = location.pathname;
    const parts = url.split("/");
    const model = parts[parts.length - 1];

    const handleEventView = (data) => {
        navigate(`/${model}/${data}`)
    }

    // Sample event data
    const eventData = [
        {
            id: 'VS7ExY0IJjovzEdc48g1',
            name: "STP Grand Event",
            location: "Kalyani, Hrittik sadan",
            date: '12/02/2023',
            time: '5pm to 8pm',
            membersJoined: 10,
            image: event1
        },
        {
            id: 'VS7ExY0IJjovzEdc48g2',
            name: "Event 2",
            location: "Location 2",
            membersJoined: 20,
            image: 'https://as1.ftcdn.net/v2/jpg/06/29/68/32/1000_F_629683211_eOwLyccce7wRa8yv52fxxEnlXsN2wIm7.jpg'
        }
    ];

    return (
        <div className='container p-2'>
            <h2 className="text-xl font-bold mb-4 text-pink-200">{model.charAt(0).toUpperCase() + model.slice(1)}s</h2>
            <div className='flex flex-wrap'>
                {eventData.map(event => (
                    <div key={event.id} className="flex flex-col justify-between rounded text-white w-80 m-2 shadow-lg overflow-hidden backdrop-filter backdrop-blur-md bg-opacity-20 bg-pink-100">
                        <img src={event.image} alt="Event Image" className="w-full object-cover h-1/2" />
                        <div className="w-full px-2 py-1">
                            <h3 className="text-xl font-semibold m-0 font-serif">{event.name}</h3>
                            <p className="text-gray-300 m-0">{event.location}</p>
                            <p className="text-gray-400 m-0 text-sm font-bold">{event.membersJoined} Members Joined</p>
                        </div>
                        <div className='flex w-full justify-end'>
                            <Button variant='outline-light' className='m-1 w-full' onClick={() => handleEventView(event.id)}>Open </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Event;
