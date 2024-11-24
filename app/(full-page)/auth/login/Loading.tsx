import React, { useState, useEffect } from 'react';
import './Loading.scss';

const Loading = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''));
        }, 500); // Adjust the speed of the dot animation as needed

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <div className="flex flex-column loading-container">
            <img
                className="loading-image"
                src={'/layout/images/flair_logo_rotational.png'}
                alt="Loading"
            />
            <h4 className="mt-4">Enhancing safety{dots}</h4>
        </div>
    );
};

export default Loading;
