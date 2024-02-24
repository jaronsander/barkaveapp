'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getUsers, getWalkers, getWalks, getWalk, updateWalk } from '../utils/requests';
import  WalkItem from './WalkItem';
import  EditWalkModal from './EditWalkModal';

const Feed = () => {
  const [walks, setWalks] = useState([]);
  const { userId, getToken } = useAuth();
  const [userMap, setUserMap] = useState({});
  const [walkerMap, setWalkerMap] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentWalkToEdit, setCurrentWalkToEdit] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [walkers, setWalkers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const sortWalks = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedWalks = walks.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });


  const changeWalk = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = await getToken({ template: 'supabase' });
      // Assume postWalk is a function similar to postTodo, adjusted for walks
      const walk = await updateWalk({ ...formData, token });
      console.log(walk);
      if (walk) {
        setSuccessMessage('Walk successfully updated!');
      }
    } catch (error) {
        setSuccessMessage('Failed to create walk. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  
  const handleEditClick = (walk) => {
    setCurrentWalkToEdit(walk);
    console.log(walk);
    setIsEditModalOpen(true);
  };
  const fetchWalks = async () => {
    const token = await getToken({ template: 'supabase' });
    try {
      const walksData = await getWalks({ token });
      console.log(walksData);
      setWalks(walksData);
    } catch (error) {
      console.error('Error fetching walks:', error.message);
      setWalks([]);
    }
  };
  const handleWalkUpdated = async () => {
    try {
      setSubmitting(true);
      const token = await getToken({ template: 'supabase' });
      // Assume postWalk is a function similar to postTodo, adjusted for walks
      const walk = await updateWalk({ ...formData, token });
      console.log(walk);
      if (walk) {
        setSuccessMessage('Walk successfully updated!');
      }
    } catch (error) {
        setSuccessMessage('Failed to create walk. Please try again.');
    } finally {
      setSubmitting(false);
    }
    setIsEditModalOpen(false);
    fetchWalks(); // Re-fetch walks to update the list with the edited walk
  };


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        let userMap = {};
        setUsers(usersData);
        usersData.forEach((user) => {
          userMap[user.id] = user;
        });
        setUserMap(userMap);
        console.log(userMap);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    }
    const fetchWalkers = async () => {
      try {
        const walkersData = await getWalkers();
        let walkerMap = {};
        setWalkers(walkersData);
        walkersData.forEach((walker) => {
          walkerMap[walker.id] = walker;
        });
        setWalkerMap(walkerMap);
        console.log(walkerMap);
      } catch (error) {
        console.error('Error fetching walkers:', error.message);
      }
    }

    fetchWalks();
    fetchUsers();
    fetchWalkers();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold my-4">Walk Feed</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border cursor-pointer" onClick={() => sortWalks('dog_name')}>User</th>
            <th className="px-4 py-2 border cursor-pointer" onClick={() => sortWalks('walker_name')}>Walker</th>
            <th className="px-4 py-2 border cursor-pointer" onClick={() => sortWalks('walk_date')}>Date</th>
            <th className="px-4 py-2 border cursor-pointer" onClick={() => sortWalks('pickup_time')}>Pickup Time</th>
            <th className="px-4 py-2 border cursor-pointer" onClick={() => sortWalks('dropoff_time')}>Dropoff Time</th>
            <th className="px-4 py-2 border"> </th>
          </tr>
        </thead>
        <tbody>
          {walks.map((walk) => (
            <WalkItem
              key={walk.id}
              user={walk.dog_name}
              walker={walk.walker_name}
              date={walk.walk_date}
              pickupTime={walk.pickup_time}
              dropoffTime={walk.dropoff_time}
              handleEdit={() => handleEditClick(walk)}
            />
          ))}
        </tbody>
      </table>
      <EditWalkModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        walk={currentWalkToEdit}
        onWalkUpdated={handleWalkUpdated}
        users={users}
        walkers={walkers}
        submitting={submitting}
      />
    </div>
  );
};

export default Feed;
