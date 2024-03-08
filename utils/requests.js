import { supabaseClient } from './supabaseClient';

const createURL = (path) => {
    return window.location.origin + path
}

export const getUsers = async () => {
    const response = await fetch(createURL('/api/getusers'), {cache: 'no-store'});
    const users = await response.json();
    return users;
}

export const getWalkers = async () => {
    const response = await fetch(createURL('/api/getwalkers'),{cache: 'no-store'});
    const walkers = await response.json();
    return walkers;
}

export const getWalks = async ({ token, page = 1, limit = 10, startDate = null, endDate = null }) => {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("dog_walks")
    .select(`*,
    dog (name),
    location (label)`, { count: 'exact' }) // Use count: 'exact' to get total count for pagination
    .range((page - 1) * limit, page * limit - 1);

  if (startDate && endDate) {
    query = query.gte('walk_date', startDate).lte('walk_date', endDate);
  }

  const { data: walks, error, count } = await query;

  if (error) {
    console.error('Error fetching walks:', error.message);
    return { walks: [], total: 0 };
  }
  return { walks, total: count };
};

export const postWalk = async ({ userId, walk, token }) => {
  const supabase = await supabaseClient(token); // Ensure supabaseClient is correctly imported and initialized

  // Add or update the user_id property of the walk object
  const walkWithUserId = {
    ...walk,
    user_id: userId,
  };
  console.log(walkWithUserId);

  const { error } = await supabase
    .from('dog_walks')
    .insert([walkWithUserId]) // Make sure to pass the modified walk object
    .single(); // Use .single() if you're inserting one record to return a single object instead of an array

  if (error) {
    console.error('Error posting walk:', error.message);
    return null;
  }
  console.log('Walk posted successfully');
  return error;
};


export const getWalk = async ({ walkId, token }) => {
  const supabase = await supabaseClient(token);
  const { data: walk, error } = await supabase
    .from("dog_walks")
    .select("*")
    .eq("id", walkId);
    console.log(walk);

  if (error) {
    console.error('Error fetching walk:', error.message);
    return null;
  }

  return walk;
}
export const updateWalk = async ({ walkId, walk, token }) => {
  const supabase = await supabaseClient(token);
  console.log(walk);
  const { error } = await supabase
    .from('dog_walks')
    .update(walk)
    .eq('id', walkId);
  
  return error;
}


export const addDog = async ({ userId, name, breed, token }) => {
  const supabase = await supabaseClient(token);
  const { data: dog, error } = await supabase
    .from('dog')
    .insert([{ user_id: userId, name: name, breed: breed }])
    .single();

  if (error) {
    console.error('Error adding dog:', error.message);
    return null;
  }

  return dog;
};

export const addLocation = async ({ userId, address, city, state, zipCode, token }) => {
  const supabase = await supabaseClient(token);
  const { data: location, error } = await supabase
    .from('location')
    .insert([{ user_id: userId, address: address, city: city, state: state, zip_code: zipCode }])
    .single();

  if (error) {
    console.error('Error adding location:', error.message);
    return null;
  }

  return location;
};

export const getDogsByUser = async ({ token }) => {
  const supabase = await supabaseClient(token);
  const { data: dogs, error } = await supabase
    .from('dog')
    .select('*')

  if (error) {
    console.error('Error fetching dogs:', error.message);
    return null;
  }

  return dogs;
};

export const getLocationsByUser = async ({ token }) => {
  const supabase = await supabaseClient(token);
  const { data: locations, error } = await supabase
    .from('location')
    .select('*')

  if (error) {
    console.error('Error fetching locations:', error.message);
    return null;
  }

  return locations;
};
  
  