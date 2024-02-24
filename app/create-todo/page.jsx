'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postTodo } from '../../utils/requests';
import { useAuth, getUserList } from '@clerk/nextjs';
import Form from '@components/WalkForm';

const CreateToDo = () => {
  const router = useRouter();
  const { userId, getToken } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ todo: '', tag: '' });

  const createTodo = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = await getToken({ template: 'supabase' });
      const posts = await postTodo({ e, userId, token });
      setFormData(posts);
      if (posts) {
        router.push('/');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form
      type='Post'
      post={formData}
      setPost={setFormData}
      submitting={submitting}
      handleSubmit={createTodo}
    />
  );
};

export default CreateToDo;
