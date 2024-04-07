import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockNetworkRequest } from '../utils/network';

export const InputOverwriteFixed = () => {
  const [input, setInput] = useState('');
  const [dirty, setDirty] = useState(false);
  const { isLoading, isError, isFetching } = useQuery({
    queryKey: ['initialValueFetchFixed'],
    queryFn: async () => {
      const response = await mockNetworkRequest();
      setInput(response.message);
      return response;
    },
    enabled: !dirty,
  });

  return (
    <div>
      <h1>Input Overwrite (Fixed, try leaving this window and coming back)</h1>
      <h3 className={isFetching ? 'loading' : undefined}>{isFetching ? 'Is fetching!' : 'Is not fetching'}</h3>
      {isLoading ? (
        <span className="loading">Loading.......</span>
      ) : isError ? (
        <span className="error">Error loading page</span>
      ) : (
        <input
          onChange={(e) => {
            setInput(e.target.value);
            setDirty(true);
          }}
          value={input}
        />
      )}
    </div>
  );
};
