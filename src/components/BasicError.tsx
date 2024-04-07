import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockFailedNetworkRequest } from '../utils/network';

export const BasicError = () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['basicError'],
    queryFn: async () => {
      const response = await mockFailedNetworkRequest();
      return response;
    },
  });

  return (
    <div>
      <h1>Basic Error Page</h1>
      <h3>Note that it attempts multiple requests (see console)</h3>
      {isLoading ? (
        <span className="loading">Loading.......</span>
      ) : isError ? (
        <span className="error">Error loading page</span>
      ) : (
        <div>
          <h2>Message:</h2>
          <div className="success">{data?.message}</div>
        </div>
      )}
    </div>
  );
};
