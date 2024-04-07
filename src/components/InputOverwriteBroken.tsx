import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockNetworkRequest } from '../utils/network';

export const InputOverwriteBroken = () => {
  const [input, setInput] = useState('');
  const { isLoading, isError, isFetching } = useQuery({
    queryKey: ['initialValueFetchBroken'],
    queryFn: async () => {
      const response = await mockNetworkRequest();
      setInput(response.message);
      return response;
    },
  });

  return (
    <div>
      <h1>Input Overwrite (Broken, try leaving this window and coming back)</h1>
      <h3 className={isFetching ? 'loading' : undefined}>{isFetching ? 'Is fetching!' : 'Is not fetching'}</h3>
      {isLoading ? (
        <span className="loading">Loading.......</span>
      ) : isError ? (
        <span className="error">Error loading page</span>
      ) : (
        <input onChange={(e) => setInput(e.target.value)} value={input} />
      )}
    </div>
  );
};
