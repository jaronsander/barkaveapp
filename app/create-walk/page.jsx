'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postWalk, getDogsByUser, getLocationsByUser, getWalkers } from '../../utils/requests';
import WalkForm from '../../components/WalkForm';
import { useAuth } from '@clerk/nextjs';

const CreateWalk = () => {
  const router = useRouter();
  const { userId, getToken } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [dogs, setDogs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [walkers, setWalkers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Assume these functions are similar to getUsers but fetch dogs, locations, and walkers
      const token = await getToken({ template: 'supabase' });
      const [dogsData, locationsData, walkersData] = await Promise.all([
        getDogsByUser({ token }),
        getLocationsByUser({ token }),
        getWalkers({ token }),
      ]);
      console.log(dogsData, locationsData, walkersData);
      setDogs(dogsData);
      setLocations(locationsData);
      setWalkers(walkersData);
    };
    fetchData();
  }, [getToken, userId]);

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      console.log(formData);
      const token = await getToken({ template: 'supabase' });
      // Adjust formData as needed before sending to your API
      const response = await postWalk({userId: userId, walk: formData, token: token });
      if (response) {
        setSuccessMessage('Walk successfully created!');
      }
    } catch (error) {
      console.error('Failed to create walk:', error.message);
      setSuccessMessage('Failed to create walk. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold my-4">Create Walk</h2>
      {successMessage && <p className="text-green-500 text-xs italic">{successMessage}</p>}
      <WalkForm
        onSubmit={handleFormSubmit}
        dogs={dogs}
        locations={locations}
        walkers={walkers}
        submitting={submitting}
      />
    </div>
  );
};

export default CreateWalk;
