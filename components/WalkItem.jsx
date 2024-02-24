import React from 'react';

const WalkItem = ({ user, walker, date, pickupTime, dropoffTime, handleEdit }) => {
  return (
    <tr>
      <td className="border px-4 py-2">{user}</td>
      <td className="border px-4 py-2">{walker}</td>
      <td className="border px-4 py-2">{date}</td>
      <td className="border px-4 py-2">{pickupTime}</td>
      <td className="border px-4 py-2">{dropoffTime}</td>
      <td className="border px-4 py-2">
        <button
          onClick={handleEdit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </button>
      </td>
    </tr>
  );
};

export default WalkItem;