/**
 * Interest Service
 * API calls for interest-related operations
 */

export interface Interest {
  id: string;
  name: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const API_BASE = '/api';

/**
 * Fetch all available interests
 */
export async function getInterests(): Promise<Interest[]> {
  const response = await fetch(`${API_BASE}/interests`);
  const result: ApiResponse<Interest[]> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch interests');
  }

  return result.data;
}

/**
 * Save user's selected interests
 */
export async function saveUserInterests(interestIds: string[]): Promise<void> {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE}/interests/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ interestIds }),
  });

  const result: ApiResponse<null> = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Failed to save interests');
  }
}

/**
 * Get user's saved interests
 */
export async function getUserInterests(): Promise<Interest[]> {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE}/interests/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result: ApiResponse<Interest[]> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch user interests');
  }

  return result.data;
}
