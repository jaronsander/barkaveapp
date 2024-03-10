import React from 'react';

const WalkItem = ({ walk, walker, handleEdit }) => {

  // Function to format time to HH:MM format
  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    return `${hours}:${minutes}`;
  };
  const formatDate = (dateString) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(dateString);
    const month = months[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}`;
  };

  // Create a Date object for the start time. The specific date doesn't matter since we're only manipulating time.
  const startTime = new Date(`2024-01-01T${walk.pickup_time}`);
  // Add one hour to the start time to calculate the end time
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 60 minutes * 60 seconds * 1000 milliseconds
  // Format the start and end times to the desired "HH:MM" format
  const timeRange = `${formatTime(startTime)} - ${formatTime(endTime)}`;

  const dte = formatDate(walk.walk_date);

  return (
    <tr>
      <td className="border px-4 py-2">{walk.dog.name}</td>
      <td className="border px-4 py-2">{walker}</td>
      <td className="border px-4 py-2">{dte}</td>
      <td className="border px-4 py-2">{timeRange}</td>
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
