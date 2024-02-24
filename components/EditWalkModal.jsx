// EditWalkModal.js
import React from 'react';
import WalkForm from './WalkForm'; // Assuming WalkForm is already created and can accept an initialWalkData prop
import { getToken, updateWalk } from '../utils/requests';
import { useAuth } from '@clerk/nextjs';

const EditWalkModal = ({ isOpen, onClose, walk, onWalkUpdated, users, walkers, submitting}) => {
  if (!isOpen) return null;
  const { userId, getToken } = useAuth();
  const handleFormSubmit = async (formData) => {
    // Assuming formData contains all necessary walk information
    const token = await getToken({ template: 'supabase' }); // getToken function needs to be available or passed as prop
    await updateWalk({ walkId: walk.id, walk: formData, token });
    onWalkUpdated(); // Callback to refresh walks list or close modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-5">
        <h2 className="text-xl font-semibold mb-4">Edit Walk</h2>
        <WalkForm initialWalk={walk} onSubmit={handleFormSubmit} users={users} walkers={walkers} submitting={submitting}/>
        <button onClick={onClose} className="mt-4 bg-gray-500 text-white py-2 px-4 rounded">Close</button>
      </div>
    </div>
  );
};

export default EditWalkModal;
