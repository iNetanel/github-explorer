/**
 * Displays a responsive grid of repository cards with modal details view
 * Handles empty states and dynamic grid sizing
 */
import React, { useState } from 'react';
import { Repository } from '../types';
import RepositoryModal from './RepositoryModal';

interface RepositoryListProps {
  repositories: Repository[];
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories }) => {
  // Track selected repository for modal display
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  // Early return for empty state
  if (repositories.length === 0) {
    return (
      <div className="empty-state">
        <p>Search for GitHub repositories above to see results here</p>
      </div>
    );
  }

  // Optimize grid layout for small result sets
  const gridClassName = `repository-grid items-${repositories.length <= 4 ? repositories.length : ''}`;
  
  return (
    <>
      <div className={gridClassName}>
        {repositories.map((repo) => (
          <div key={repo.id} className="repository-card">
            <div>
              <h3>{repo.name}</h3>
              <p>{repo.description || 'No description available'}</p>
              <div className="repository-stats">
                <span>⭐ {repo.stargazers_count}</span>
                <span>🔀 {repo.forks_count}</span>
                <span>⚠️ {repo.open_issues_count}</span>
              </div>
            </div>
            <div className="card-footer">
              <button 
                className="button-primary"
                onClick={() => setSelectedRepo(repo)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal renders conditionally when repository is selected */}
      {selectedRepo && (
        <RepositoryModal
          repository={selectedRepo}
          isOpen={!!selectedRepo}
          onClose={() => setSelectedRepo(null)}
        />
      )}
    </>
  );
};

export default RepositoryList;
