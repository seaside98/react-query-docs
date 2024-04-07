import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockPageNetworkRequest } from '../utils/network';

export const UserInput = () => {
  const [page, setPage] = useState(0);
  const { isLoading, isError, data } = useQuery({
    queryKey: ['userInput', page], // <-- The important bit!
    queryFn: async () => {
      const response = await mockPageNetworkRequest(page);
      return response;
    },
  });

  return (
    <div>
      <h1>User Input</h1>
      <h3>Page Number: {page}</h3>
      <div>
        <button onClick={() => setPage(page + 1)}>Next Page</button>
        <button onClick={() => setPage(page - 1)}>Previous Page</button>
      </div>

      {isLoading ? (
        <span className="loading">Loading.......</span>
      ) : isError ? (
        <span className="error">Error loading page</span>
      ) : (
        <div>
          <h2>Page {page} Message:</h2>
          <div className="success">{data?.message}</div>
        </div>
      )}
    </div>
  );
};
