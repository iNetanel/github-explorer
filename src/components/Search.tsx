// src/components/Search.tsx
import React, { useState } from 'react';
import { searchRepositories } from '../services/Github';
import { Repository } from '../types';

interface SearchProps {
  onSearchResults: (results: Repository[]) => void;
  onError: (error: string) => void;
}

function Search({ onSearchResults, onError }: SearchProps) {
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const results = await searchRepositories(searchText);
      onSearchResults(results);
    } catch (error) {
      onError('Failed to fetch repositories');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search GitHub repositories..."
        disabled={isLoading}
      />
      <button type="submit" className="button-primary" disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}

export default Search;