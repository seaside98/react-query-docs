import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { mockNetworkRequest } from '../utils/network';

export const MutationBasic = () => {
  const { isPending, isError, isSuccess, data, mutate } = useMutation({
    mutationFn: async () => {
      const response = await mockNetworkRequest();

      return response;
    },
  });

  return (
    <div>
      <h1>Basic Mutation</h1>
      <div>
        <button onClick={() => mutate()}>Submit</button>
      </div>
      {isPending ? (
        <span className="loading">Pending.......</span>
      ) : isError ? (
        <span className="error">Error Submitting</span>
      ) : isSuccess ? (
        <div>
          <h2>Response:</h2>
          <div className="success">{data?.message}</div>
        </div>
      ) : undefined}
    </div>
  );
};
