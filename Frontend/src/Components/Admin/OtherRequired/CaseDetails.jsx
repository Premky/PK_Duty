import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CaseDetails = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('token');
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  const { caseName, type } = useParams(); // Get the params from the route

  // Fetch all records from API
  const fetchRecords = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/prisioner/get_prisioners`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { Status, Result, Error } = response.data;

      if (Status) {
        setRecords(Result || []); // Set records if available
      } else {
        setError(Error || 'Failed to fetch records.');
      }
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('An error occurred while fetching records.');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Filter records based on caseName and type
  const filteredRecords = records.filter(record => record.case_np === caseName && (!type || record.type === type));

  return (
    <div>
      <h2>Details for {caseName}</h2>
      {type && <h3>Showing {type} Details</h3>}

      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <ul>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((item, index) => (
              <li key={index}>
                {item.prisioner_type} {/* Replace with the actual data field */}
              </li>
            ))
          ) : (
            <p>No records found for {caseName}.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default CaseDetails;
