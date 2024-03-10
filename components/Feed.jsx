'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getUsers, getWalkers, getWalks, getDogsByUser, updateWalk } from '../utils/requests';
import  WalkItem from './WalkItem';
import GroupWalkItem from './GroupWalkItem';
import  EditWalkModal from './EditWalkModal';

const Feed = () => {
  const [walks, setWalks] = useState([]);
  const { userId, getToken } = useAuth();
  const [walkerMap, setWalkerMap] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentWalkToEdit, setCurrentWalkToEdit] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [walkers, setWalkers] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10); // You can adjust the limit as needed
  const [dateFilter, setDateFilter] = useState('');

  const preprocessWalks = (walks) => {
    const groups = {}; // For grouping group walks
    const result = []; // To hold both group and non-group walks
  
    walks.forEach(walk => {
      // Handle group walks
      if (walk.walk_type === 'Group') {
        const key = `${walk.walk_date}-${walk.group_tag}-${walk.walker_id}`;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(walk);
      } else {
        // Handle non-group walks by adding them directly to the result
        result.push({
          type: walk.walk_type,
          walk: walk,
        });
      }
    });
  
    // Process group walks and add them to the result
    Object.values(groups).forEach(groupWalks => {
      result.push({
        type: 'Group',
        details: groupWalks[0], // Details from the first walk for displaying group info
        walks: groupWalks, // All walks in the group
      });
    });
  
    return result;
  };  

  useEffect(() => {
    const sortArray = (array) => {
      const sortedArray = [...array].sort((a, b) => {
        if (!sortConfig.key) return 0; // If no sort key, don't sort
        
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      return sortedArray;
    };
  
    // Only sort walks if sortConfig.key is not null
    if (sortConfig.key) {
      const sortedWalks = sortArray(walks);
      setWalks(sortedWalks);
    }
  }, [sortConfig]); 
  
  const handleEditClick = (walk) => {
    setCurrentWalkToEdit(walk);
    console.log(walk);
    setIsEditModalOpen(true);
  };
  const fetchWalks = async () => {
    const token = await getToken({ template: 'supabase' });
    try {
      const walksData = await getWalks({ token });
      const preprocessedWalks = preprocessWalks(walksData.walks);
      console.log(preprocessedWalks);
      setWalks(preprocessedWalks);
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
    if (userId) { // Ensure userId is not null or undefined
      const fetchAllData = async () => {
        const token = await getToken({ template: 'supabase' });
        
        try {
          // Fetch walks, walkers, and dogs in parallel for efficiency
          const walksData = await getWalks({ token });
          const preprocessedWalks = preprocessWalks(walksData.walks);
          console.log(preprocessedWalks);
          setWalks(preprocessedWalks);

          const walkersData = await getWalkers({ token });
          console.log(walkersData);
          setWalkerMap(walkersData.reduce((acc, walker) => {
            acc[walker.id] = walker.firstName;
            return acc;
          }, {}));
          setWalkers(walkersData);

          const dogsData = await getDogsByUser({ userId, token });
          setDogs(dogsData);
          
          let startDate = null, endDate = null;
          if (dateFilter === 'tomorrow') {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              startDate = tomorrow.toISOString().split('T')[0];
              endDate = startDate;
          } else if (dateFilter === 'next7Days') {
              const today = new Date();
              const next7Days = new Date();
              next7Days.setDate(today.getDate() + 7);
              startDate = today.toISOString().split('T')[0];
              endDate = next7Days.toISOString().split('T')[0];
          }

          const { walks, total } = await getWalks({ token, page, limit, startDate, endDate });
          const preprocessed = preprocessWalks(walks);
          console.log(preprocessed);
          setWalks(preprocessed);
          setTotal(total);
        } catch (error) {
          console.error('Error fetching data:', error.message);
          // Handle errors as needed
        }
      };
      fetchAllData();
    } else {
      // Handle case where userId is null or undefined
      console.error('User ID is not available');
    }
  }, [userId, getToken, page, limit, dateFilter]);

  return (
    <div>
      <h2 className="text-2xl font-semibold my-4">Walk Feed</h2>
      <div className="my-4">
        <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700">
          Filter by Date:
        </label>
        <select
          id="dateFilter"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">All Dates</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="next7Days">Next 7 Days</option>
        </select>
      </div>
      <table className="min-w-full table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2 border">Dog</th>
          <th className="px-4 py-2 border">Walker</th>
          <th className="px-4 py-2 border">Date</th>
          <th className="px-4 py-2 border">Pickup Time</th>
          <th className="px-4 py-2 border"></th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(walkerMap).length > 0 && walks.map((item, index) => {
          if (item.type === 'Group') {
            // Render GroupWalkItem for grouped walks
            return <GroupWalkItem key={`group-${index}`} groupDetails={item.details} walks={item.walks} walkerMap={walkerMap} handleEdit={handleEditClick}/>;
          } else {
            // Render WalkItem for individual walks
            console.log(item.walk);
            return <WalkItem key={item.walk.id} walk={item.walk} walker={walkerMap[item.walk.walker_id]} handleEdit={() => handleEditClick(item.walk)} />
          }
        })}
      </tbody>
    </table>
      <div className="pagination-controls flex items-center space-x-2 my-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm font-medium text-gray-700">Page {page} of {Math.ceil(total / limit)}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * limit >= total}
          className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <EditWalkModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        walk={currentWalkToEdit}
        onWalkUpdated={handleWalkUpdated}
        dogs={dogs}
        walkers={walkers}
        submitting={submitting}
      />
    </div>
  );
};

export default Feed;
