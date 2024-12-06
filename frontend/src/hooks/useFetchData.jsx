import { useEffect, useState } from 'react';
import { token } from '../config';

const useFetchData = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(url, {
                    headers: { token }, // Pass token in the 'token' header
                });

                const result = await res.json();

                if (!res.ok) {
                    throw new Error(result.message + '🤢');
                }

                setData(result.data);
            } catch (error) {
                console.error('Error fetching data:', error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [url]);

    return { data, loading, error }; // Return as an object
};

export default useFetchData;
