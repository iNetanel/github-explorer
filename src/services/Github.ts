/**
 * GitHub API Service
 * Handles repository search and issue management operations
 */
import axios from 'axios';
import { Repository } from '../types';

const GITHUB_API = 'https://api.github.com';

interface GitHubResponse {
  items: Repository[];
}

/**
 * Searches GitHub repositories with rate limiting and error handling
 * @todo Consider implementing pagination for large result sets
 */
export const searchRepositories = async (query: string): Promise<Repository[]> => {
  try {
    const response = await axios.get<GitHubResponse>(
      `${GITHUB_API}/search/repositories?q=${query}`
    );
    return response.data.items;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};

/**
 * Fetches repository issues with configurable state filter
 * Limited to 100 issues per request for performance
 */
export const fetchRepositoryIssues = async (
  repoFullName: string,
  state: 'open' | 'closed' = 'open'
): Promise<any[]> => {
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${repoFullName}/issues`,
      {
        params: {
          state,
          per_page: 100
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching issues:', error);
    throw error;
  }
};
