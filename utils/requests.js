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

// Function to fetch todos from Supabase
export const getTodos = async ({ userId, token }) => {
  const supabase = await supabaseClient(token);
  const { data: todos, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error('Error fetching todos:', error.message);
    return [];
  }

  return todos;
};
export const getWalks = async ({ token }) => {
    const supabase = await supabaseClient(token);
    const { data: walks, error } = await supabase
      .from("dog_walks")
      .select("*")
  
    if (error) {
      console.error('Error fetching walks:', error.message);
      return [];
    }
    return walks;
  };

export const postTodo = async ({ userId, token, e }) => {
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase
      .from('todos')
      .insert({
        user_id: userId,
        todo: e.target[0].value,
        tag: e.target[1].value,
      })
      .select();
  
    if (error) {
      console.error('Error posting todo:', error.message);
      return null;
    }
  
    return data;
  };

  export const postWalk = async ({ userId, walkerId, walkDate, pickupTime, dropoffTime, walkType, notes, status, dogName, walkerName, token }) => {
    const supabase = await supabaseClient(token); // Ensure supabaseClient is correctly imported and initialized
    const { error } = await supabase
      .from('dog_walks')
      .insert([{
        user_id: userId,
        dog_name: dogName,
        walker_id: walkerId,
        walker_name: walkerName,
        walk_date: walkDate,
        pickup_time: pickupTime,
        dropoff_time: dropoffTime,
        walk_type: walkType,
        notes: notes,
        status: status,
      }])
      .single(); // Use .single() if you're inserting one record to return a single object instead of an array
  
    if (error.status === 406) {
      console.error('Error posting walk:', error.message);
      return null;
    }
    console.log(error);
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
  

