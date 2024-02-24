import React, { useState, useEffect } from 'react';

const WalkForm = ({ initialWalk = {}, onSubmit, users, walkers, submitting}) => {
  // If initialWalk has values, it's for editing; otherwise, it's for creating a new walk.
  const [formData, setFormData] = useState(() => ({
    user_id: initialWalk.user_id || '',
    walker_id: initialWalk.walker_id || '',
    walk_date: initialWalk.walk_date || '',
    pickup_time: initialWalk.pickup_time || '',
    dropoff_time: initialWalk.dropoff_time || '',
    walk_type: initialWalk.walk_type || '',
    notes: initialWalk.notes || '',
    status: initialWalk.status || 'Scheduled', // Assuming 'Scheduled' as a default status
  }));

  // Effect hook to update form data when initialWalk changes, for example, when opening an edit modal
  useEffect(() => {
    setFormData({
      user_id: initialWalk.user_id || '',
      walker_id: initialWalk.walker_id || '',
      walk_date: initialWalk.walk_date || '',
      pickup_time: initialWalk.pickup_time || '',
      dropoff_time: initialWalk.dropoff_time || '',
      walk_type: initialWalk.walk_type || '',
      notes: initialWalk.notes || '',
      status: initialWalk.status || 'Scheduled',
    });
    console.log(initialWalk);
  }, [initialWalk.user_id, initialWalk.walker_id, initialWalk.walk_date, initialWalk.pickup_time, initialWalk.dropoff_time, initialWalk.walk_type, initialWalk.notes, initialWalk.status]); // List all properties of initialWalk used in the effect

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData)
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {/* Form Fields Here - Similar to your provided code but using formData for value bindings */}
      {/* Example for the User field */}
      {initialWalk.id}
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user_id">
            User
          </label>
          <select
            id="user_id"
            name="user_id"
            onChange={handleInputChange}
            value={formData.user_id}
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
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="walker_id">
          Walker
        </label>
        <select
          id="walker_id"
          name="walker_id"
          onChange={handleInputChange}
          value={formData.walker_id}
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
          id="walk_date"
          name="walk_date"
          value={formData.walk_date}
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
          id="pickup_time"
          name="pickup_time"
          value={formData.pickup_time}
          onChange={handleInputChange}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dropoff_time">
          Dropoff Time
        </label>
        <input
          type="time"
          id="dropoff_time"
          name="dropoff_time"
          value={formData.dropoff_time}
          onChange={handleInputChange}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="w-full md:w-1/2 px-3">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="walk_type">
          Walk Type
        </label>
        <select
          id="walk_type"
          name="walk_type"
          onChange={handleInputChange}
          value={formData.walk_type}
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
          {initialWalk.id ? 'Update Walk' : 'Create Walk'}
        </button>
      </div>
      {!submitting && formData.submitSuccess && (
        <p className="text-green-500 text-xs italic">Walk successfully {initialWalk.id ? 'updated' : 'created'}.</p>
      )}
    </form>
  );
};

export default WalkForm;