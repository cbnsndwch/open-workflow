import { LoginRecord } from '../types';

// Function to get login history from localStorage
export const getLoginHistory = (userId: string): LoginRecord[] => {
  try {
    const historyStr = localStorage.getItem(`login_history_${userId}`);
    if (historyStr) {
      return JSON.parse(historyStr);
    }
  } catch (error) {
    console.error('Error retrieving login history:', error);
  }
  return [];
};

// Function to add login record to localStorage
export const addLoginRecord = (userId: string, email: string) => {
  try {
    const history = getLoginHistory(userId);
    const newRecord: LoginRecord = {
      timestamp: new Date().toISOString(),
      email: email
    };
    
    // Add the new record at the beginning of the array
    history.unshift(newRecord);
    
    // Keep only the last 20 logins
    const limitedHistory = history.slice(0, 20);
    localStorage.setItem(`login_history_${userId}`, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error saving login history:', error);
  }
};
