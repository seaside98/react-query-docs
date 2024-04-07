import React, { useState } from 'react';
import './App.css';
import { Basic } from './components/Basic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BasicError } from './components/BasicError';
import { BasicWithFetching } from './components/BasicWithFetching';
import { UserInput } from './components/UserInput';
import { MutationBasic } from './components/MutationBasic';
import { InputOverwriteBroken } from './components/InputOverwriteBroken';
import { InputOverwriteFixed } from './components/InputOverwriteFixed';

const queryClient = new QueryClient();

function App() {
  const [page, setPage] = useState('basic');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <header className="App-header">
          <button onClick={() => setPage('basic')}>Basic</button>
          <button onClick={() => setPage('basicError')}>Basic Error</button>
          <button onClick={() => setPage('basicWithFetching')}>Basic With Fetching</button>
          <button onClick={() => setPage('userInput')}>User Input</button>
          <button onClick={() => setPage('mutationBasic')}>Mutation Basic</button>
          <button onClick={() => setPage('inputOverwriteBroken')}>Input Overwrite Broken</button>
          <button onClick={() => setPage('inputOverwriteFixed')}>Input Overwrite Fixed</button>
        </header>
        {page === 'basic' ? (
          <Basic />
        ) : page === 'basicError' ? (
          <BasicError />
        ) : page === 'basicWithFetching' ? (
          <BasicWithFetching />
        ) : page === 'userInput' ? (
          <UserInput />
        ) : page === 'mutationBasic' ? (
          <MutationBasic />
        ) : page === 'inputOverwriteBroken' ? (
          <InputOverwriteBroken />
        ) : page === 'inputOverwriteFixed' ? (
          <InputOverwriteFixed />
        ) : (
          <div>Page not found</div>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
