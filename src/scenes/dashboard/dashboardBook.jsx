import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardBook = () => {
    const [memberCar, setMemberCar] = useState([]);
    const [memberRoom, setMemberRoom] = useState([]);
    const [allCars, setAllCars] = useState([]);
    const [allRooms, setAllRooms] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch member-specific cars
                const carRes = await axios.get(`/api/cars/list/memberId`);
                const memberCarData = carRes.data;

                // Fetch all cars
                const allCarsRes = await axios.get(`/api/cars/list`);
                const allCarsData = allCarsRes.data;

                // Match and add photo to memberCar
                const updatedMemberCarData = memberCarData.map(memberCar => {
                    const matchingCar = allCarsData.find(car => car.id === memberCar.corporateCarId);
                    return {
                        ...memberCar,
                        photo: matchingCar ? matchingCar.photo : null,
                        type: matchingCar ? matchingCar.type : null
                    };
                });
                setMemberCar(updatedMemberCarData);

                // Fetch member-specific rooms
                const roomRes = await axios.get(`/api/rooms/list/memberId`);
                const memberRoomData = roomRes.data;

                // Fetch all rooms
                const allRoomsRes = await axios.get(`/api/rooms/list`);
                const allRoomsData = allRoomsRes.data;

                // Match and add photo to memberRoom
                const updatedMemberRoomData = memberRoomData.map(memberRoom => {
                    const matchingRoom = allRoomsData.find(room => room.id === memberRoom.roomId);
                    return {
                        ...memberRoom,
                        photo: matchingRoom ? matchingRoom.photo : null,
                        name: matchingRoom ? matchingRoom.name : null
                    };
                });
                setMemberRoom(updatedMemberRoomData);

                // Optional: Store allCars and allRooms data if needed
                setAllCars(allCarsData);
                setAllRooms(allRoomsData);
            } catch (err) {
                console.error("Error fetching info:", err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard-container" style={{
            padding: '10px', height: '100%', overflowY: 'auto', overflowX: 'hidden',

            '&::-webkit-scrollbar': {
            display: 'none',
        },
            '-ms-overflow-style': 'none',  /* IE and Edge */
            'scrollbar-width': 'none',  /* Firefox */
        }}>
            {memberCar.map((car, index) => (
                <div
                    key={index}
                    style={{
                        marginBottom: '15px', // Spacing between items
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Shadow effect
                        backgroundColor: '#fff', // Card background color
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px', // Padding inside card
                    }}>
                        {/* Car Image */}
                        <img
                            src={`https://minio.bmops.kro.kr/groupbee/book/${car.photo}`}
                            alt={car.type}
                            style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                marginRight: '20px',
                            }}
                        />

                        {/* Car Information */}
                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#333', // Title color
                            }}>
                                {car.type}
                            </h3>

                            <p style={{
                                margin: '0',
                                fontSize: '14px',
                                color: '#555', // Text color
                            }}>
                                대여시간 : {new Date(car.rentDay).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })} ~ {new Date(car.returnDay).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                            </p>

                            <p style={{
                                margin: '0',
                                fontSize: '14px',
                                color: '#777', // Text color
                            }}>
                                사유 : {car.reason}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
            {memberRoom.map((room, index) => (
                <div
                    key={index}
                    style={{
                        marginBottom: '15px', // Spacing between items
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Shadow effect
                        overflow: 'hidden', // Prevents content from overflowing
                        backgroundColor: '#fff', // Card background color
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px', // Padding inside card
                    }}>
                        {/* Room Image */}
                        <img
                            src={`https://minio.bmops.kro.kr/groupbee/book/${room.photo}`}
                            alt={room.name}
                            style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                marginRight: '20px',
                            }}
                        />

                        {/* Room Information */}
                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#333', // Title color
                            }}>
                                {room.name}
                            </h3>

                            <p style={{
                                margin: '0',
                                fontSize: '14px',
                                color: '#555', // Text color
                            }}>
                                대여시간 : {new Date(room.enter).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })} ~ {new Date(room.leave).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                            </p>

                            <p style={{
                                margin: '0',
                                fontSize: '14px',
                                color: '#777', // Text color
                            }}>
                                사유 : {room.purpose}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardBook;
