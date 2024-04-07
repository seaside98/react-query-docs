import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockNetworkRequest } from '../utils/network';

export const BasicWithFetching = () => {
  const { isLoading, isError, isFetching, data } = useQuery({
    queryKey: ['basic'],
    queryFn: async () => {
      const response = await mockNetworkRequest();
      return response;
    },
  });

  return (
    <div>
      <h1>Basic Page (with fetching status)</h1>
      <h3 className={isFetching ? 'loading' : undefined}>{isFetching ? 'Is fetching!' : 'Is not fetching'}</h3>
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
