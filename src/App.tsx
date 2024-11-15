/**
 * @file App.tsx
 * @description Main application component for Jam7's GitHub Repository Explorer
 * @author Netanel Eliav
 * @version 1.0.0
 * 
 * This application provides a user interface for searching and exploring GitHub repositories
 * utilizing GitHub's REST API. It demonstrates modern React patterns and TypeScript integration.
 */

import React, { useState } from 'react';
import logo from './jam7_logo.png';
import Search from './components/Search';
import RepositoryList from './components/RepositoryList';
import { Repository } from './types';
import './App.css';

/**
 * Main Application Component
 * 
 * Implements a single-page application architecture with the following features:
 * - GitHub repository search functionality
 * - Real-time error handling
 * - Responsive design
 * - Background music integration for enhanced UX
 */
function App(): JSX.Element {
  // Application state management using React hooks
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [error, setError] = useState<string>('');

  /**
   * Handler for search results
   * @param results - Array of repository objects returned from the GitHub API
   */
  const handleSearchResults = (results: Repository[]): void => {
    setRepositories(results);
  };
  
  return (
    <div className="Jam7">
      <header className="Jam7-header">
        {/* External link to company website with security best practices */}
        <a href="https://jam7.com" 
           target="_blank" 
           rel="noopener noreferrer">
          <img src={logo} 
               className="Jam7-logo" 
               alt="jam7_logo" />
        </a>
        <h1>Jam7's GitHub Repository Explorer</h1>

        {/* Search component with error handling */}
        <Search 
          onSearchResults={setRepositories}
          onError={setError}
        />

        {/* Conditional error message rendering */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Repository display component */}
        <RepositoryList repositories={repositories} />
      </header>
      {/* Application footer with dynamic year update */}
      <footer className="Jam7-footer">
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} - Built with ♥ by <a href="https://inetanel.com" target="_blank">Netanel Eliav</a></p>
      </div>
      </footer>
    </div>
  );
}

export default App;
