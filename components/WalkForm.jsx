import React, { useState, useEffect } from 'react';

const groupTags = [
  { id: 1, name: 'Group 1' },
  { id: 2, name: 'Group 2' },
  { id: 3, name: 'Group 3' },
  { id: 4, name: 'Group 4' },
  { id: 5, name: 'Group 5' },
  { id: 6, name: 'Group 6' },
  { id: 7, name: 'Group 7' },
  { id: 8, name: 'Group 8' },
  { id: 9, name: 'Group 9' },
];


const WalkForm = ({ initialWalk = {}, onSubmit, dogs, walkers, submitting, successMessage}) => {
  // If initialWalk has values, it's for editing; otherwise, it's for creating a new walk.
  const [formData, setFormData] = useState(() => ({
    user_id: initialWalk.user_id || '',
    walker_id: initialWalk.walker_id || '',
    walk_date: initialWalk.walk_date || '',
    pickup_time: initialWalk.pickup_time || '',
    walk_type: initialWalk.walk_type || '',
    notes: initialWalk.notes || '',
    status: initialWalk.status || 'Scheduled',
    group_tag: initialWalk.group_tag || '', // Added for group walk picker
  }));


  // Effect hook to update form data when initialWalk changes, for example, when opening an edit modal
  useEffect(() => {
    setFormData({
      user_id: initialWalk.user_id || '',
      walker_id: initialWalk.walker_id || '',
      walk_date: initialWalk.walk_date || '',
      pickup_time: initialWalk.pickup_time || '',
      walk_type: initialWalk.walk_type || '',
      notes: initialWalk.notes || '',
      status: initialWalk.status || 'Scheduled',
      dog_id: initialWalk.dog_id || '', 
      group_tag: initialWalk.group_tag || '', // Added for group walk picker
    });
    console.log(initialWalk);
  }, [initialWalk.user_id, initialWalk.walker_id, initialWalk.walk_date, initialWalk.pickup_time, initialWalk.walk_type, initialWalk.notes, initialWalk.status]); // List all properties of initialWalk used in the effect

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = onSubmit(formData);
    console.log(result);
    if (result) {
      setSubmitSuccess(true);
    }
  };

  return (  
    <form onSubmit={handleSubmit} className="bg-white rounded px-8 pt-6 pb-8 mb-4">
      <div className="flex flex-wrap -mx-3">
        {/* Dog Picker */}
        <div className="w-full md:w-1/3 px-3 mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dog_id">
            Dog
          </label>
          <select
            id="dog_id"
            name="dog_id"
            onChange={handleInputChange}
            value={formData.dog_id}
            required
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Dog</option>
            {dogs.map((dog) => (
              <option key={dog.id} value={dog.id}>{dog.name}</option>
            ))}
          </select>
        </div>
        {/* Walker Picker */}
        <div className="w-full md:w-1/3 px-3 mb-6">
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
              <option key={walker.id} value={walker.id}>{walker.firstName}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6">
          {/* Pickup Time */}
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
        <div className="w-full md:w-1/3 px-3 mb-6">
          {/* Walk Type */}
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
        {/* Walk Date */}
        <div className="w-full md:w-1/3 px-3 mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="walk_date">
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

        {formData.walk_type === 'Group' && (
          <div className="w-full md:w-1/3 px-3 mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="group_tag">
              Group Tag
            </label>
            <select
              id="group_tag"
              name="group_tag"
              onChange={handleInputChange}
              value={formData.group_tag} // Corrected from formData.walker_id to formData.group_tag
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Group</option>
              {groupTags.map((group) => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>
        )}

      </div>
      
    <div className="flex flex-wrap -mx-3">
      <div className="w-full px-3 mb-6">
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
      <div className="flex flex-wrap -mx-3">
        <div className="w-full px-3">
          {/* Submit Button and Success Message */}
          <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {initialWalk.id ? 'Update Walk' : 'Create Walk'}
          </button>
        </div>
        {successMessage && <p className="text-green-500 text-xs italic">{successMessage}</p>}
        </div>
      </div>
    </form>
  );
};

export default WalkForm;