/**
 * Modal component for detailed repository view
 * Features: Issue tracking, statistics visualization, and dynamic data loading
 */
import React, { useState, useEffect } from 'react';
import { Repository } from '../types';
import { fetchRepositoryIssues } from '../services/Github';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Visual configuration for the issues chart
const CHART_COLORS = {
  open: "#f739ec",
  closed: "#7f1de8"
};

interface RepositoryModalProps {
  repository: Repository;
  isOpen: boolean;
  onClose: () => void;
}

function RepositoryModal({ repository, isOpen, onClose }: RepositoryModalProps) {
  // State management for issues data and UI controls
  const [issues, setIssues] = useState<any[]>([]);
  const [issueState, setIssueState] = useState<'open' | 'closed'>('open');
  const [isLoading, setIsLoading] = useState(false);
  const [closedIssuesCount, setClosedIssuesCount] = useState(0);

  // Fetch closed issues count for chart visualization
  useEffect(() => {
    const fetchClosedIssues = async () => {
      try {
        const closedIssues = await fetchRepositoryIssues(repository.full_name, 'closed');
        setClosedIssuesCount(closedIssues.length);
      } catch (error) {
        console.error('Error fetching closed issues:', error);
      }
    };
    
    if (isOpen) {
      fetchClosedIssues();
    }
  }, [isOpen, repository.full_name]);

  // Load issues based on selected state (open/closed)
  useEffect(() => {
    const loadIssues = async () => {
      setIsLoading(true);
      try {
        const fetchedIssues = await fetchRepositoryIssues(repository.full_name, issueState);
        setIssues(fetchedIssues);
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadIssues();
    }
  }, [isOpen, repository.full_name, issueState]);

  if (!isOpen) return null;

  // Prepare data for the pie chart
  const chartData = [
    { 
      name: 'Open Issues', 
      value: repository.open_issues_count,
      fill: CHART_COLORS.open
    },
    { 
      name: 'Closed Issues', 
      value: closedIssuesCount,
      fill: CHART_COLORS.closed
    }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>{repository.name}</h2>
        <p>{repository.description}</p>
        
        <div className="repository-details">
          <p>Repository URL: <a href={repository.html_url} target="_blank" rel="noopener noreferrer">
            {repository.html_url}
          </a></p>
          <div className="stats-grid">
            <div>⭐ Stars: {repository.stargazers_count}</div>
            <div>🔀 Forks: {repository.forks_count}</div>
            <div>👀 Watchers: {repository.watchers_count}</div>
            <div>⚠️ Open Issues: {repository.open_issues_count}</div>
          </div>
        </div>

        <div className="issues-section">
          <h3>Issues</h3>
          <div className="issues-controls">
            <select 
              value={issueState} 
              onChange={(e) => setIssueState(e.target.value as 'open' | 'closed')}
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="issues-chart">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {isLoading ? (
            <div>Loading issues...</div>
          ) : (
            <div className="issues-list">
              {issues.length === 0 ? (
                <div>No {issueState} issues found</div>
              ) : (
                issues.map(issue => (
                  <div key={issue.id} className="issue-item">
                    <h4>{issue.title}</h4>
                    <p>#{issue.number} opened by {issue.user.login}</p>
                    <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
                      View Issue
                    </a>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RepositoryModal;
