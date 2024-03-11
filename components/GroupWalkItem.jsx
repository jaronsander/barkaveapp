import React, { useState } from 'react';
import WalkItem from './WalkItem';

const GroupWalkItem = ({ groupDetails, walks, walkerMap, handleEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  console.log(walkerMap);
  const toggleGroupDetails = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <tr className="group-walk-item" onClick={toggleGroupDetails}>
        <td colSpan="5" className="border px-4 py-2 cursor-pointer bg-gray-200 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span>Group: {groupDetails.group_tag} - {formatDate(groupDetails.walk_date)}: {walkerMap[groupDetails.walker_id]}</span>
            <span>{isExpanded ? '▲' : '▼'}</span>
          </div>
        </td>
      </tr>
      {isExpanded && walks.map(walk => (
        <WalkItem 
          key={walk.id} 
          walk={walk} 
          walker={walkerMap[walk.walker_id] || 'Unknown Walker'} 
          handleEdit={() => handleEdit(walk)}
        />
      ))}
    </>
  );
};

export default GroupWalkItem;
