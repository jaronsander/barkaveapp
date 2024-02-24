'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postWalk, getUsers, getWalkers } from '../../utils/requests';
import { useAuth } from '@clerk/nextjs';

const CreateWalk = () => {
  const router = useRouter();
  const { userId, getToken } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    walkDate: '',
    pickupTime: '',
    dropoffTime: '',
    walkType: '',
    notes: '',
    status: '',
    userId: '',
    walkerId: '',
  });
  const [users, setUsers] = useState([]);
  const [walkers, setWalkers] = useState([]);
  const fetchUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  // Fetch walkers
  const fetchWalkers = async () => {
    try {
      const walkersData = await getWalkers();
      setWalkers(walkersData);
    } catch (error) {
      console.error('Error fetching walkers:', error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchWalkers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const createWalk = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = await getToken({ template: 'supabase' });
      const dogName = users.find((user) => user.id === formData.userId).firstName;
      const walkerName = walkers.find((walker) => walker.id === formData.walkerId).firstName;
      // Assume postWalk is a function similar to postTodo, adjusted for walks

      const walk = await postWalk({ ...formData, dogName, walkerName, token });
      console.log(walk);
      if (walk) {
        setSuccessMessage('Walk successfully created!');
        setFormData({
          walkDate: '',
          pickupTime: '',
          dropoffTime: '',
          walkType: '',
          notes: '',
          status: 'Scheduled',
          userId: '',
          walkerId: '',
        });
      }
    } catch (error) {
        setSuccessMessage('Failed to create walk. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
  <form onSubmit={createWalk} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div className="flex flex-wrap -mx-3 mb-6">
      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userId">
          User
        </label>
        <select
          id="userId"
          name="userId"
          onChange={handleInputChange}
          value={formData.userId}
          required
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.emailAddresses[0].emailAddress}</option>
          ))}
        </select>
      </div>
      <div className="w-full md:w-1/2 px-3">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="walkerId">
          Walker
        </label>
        <select
          id="walkerId"
          name="walkerId"
          onChange={handleInputChange}
          value={formData.walkerId}
          required
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select Walker</option>
          {walkers.map((walker) => (
            <option key={walker.id} value={walker.id}>{walker.emailAddresses[0].emailAddress}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="flex flex-wrap -mx-3 mb-6">
      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="walkDate">
          Walk Date
        </label>
        <input
          type="date"
          id="walkDate"
          name="walkDate"
          value={formData.walkDate}
          onChange={handleInputChange}
          required
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="w-full md:w-1/2 px-3">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pickupTime">
          Pickup Time
        </label>
        <input
          type="time"
          id="pickupTime"
          name="pickupTime"
          value={formData.pickupTime}
          onChange={handleInputChange}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
    </div>

    <div className="flex flex-wrap -mx-3 mb-6">
      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dropoffTime">
          Dropoff Time
        </label>
        <input
          type="time"
          id="dropoffTime"
          name="dropoffTime"
          value={formData.dropoffTime}
          onChange={handleInputChange}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="w-full md:w-1/2 px-3">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="walkType">
          Walk Type
        </label>
        <select
          id="walkType"
          name="walkType"
          onChange={handleInputChange}
          value={formData.walkType}
          required
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select Walk Type</option>
          <option value="Group">Group</option>
          <option value="On Leash Group">On Leash Group</option>
          <option value="Private">Private</option>
          <option value="Private Park">Private Park</option>
        </select>
      </div>
    </div>

    <div className="flex flex-wrap -mx-3 mb-6">
      <div className="w-full px-3">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows="3"
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
      </div>
    </div>

    <div className="flex flex-wrap -mx-3 mb-6">
      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          name="status"
          onChange={handleInputChange}
          value={formData.status}
          required
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select Status</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Create Walk
      </button>
    </div>
    {!submitting && formData.submitSuccess && (
      <p className="text-green-500 text-xs italic">Walk successfully created.</p>
    )}
  </form>
</div>


  );
};

export default CreateWalk;
