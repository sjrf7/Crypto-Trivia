/**
 * A simple client-side storage solution for AI challenges
 * to avoid extremely long URLs.
 */
import { AITriviaGame } from './types/ai';

const STORAGE_KEY = 'ai_challenges';

// Function to generate a unique ID
const generateId = () => {
    return Math.random().toString(36).substring(2, 10);
}

// Function to store challenge data and return a unique ID
export const storeChallenge = (data: AITriviaGame): string => {
    if (typeof window === 'undefined') return '';
    try {
        const id = generateId();
        const challenges = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
        challenges[id] = data;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
        return id;
    } catch (error) {
        console.error("Failed to store challenge in localStorage", error);
        return '';
    }
};

// Function to retrieve challenge data by ID
export const getChallenge = (id: string): AITriviaGame | null => {
    if (typeof window === 'undefined') return null;
    try {
        const challenges = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
        return challenges[id] || null;
    } catch (error) {
        console.error("Failed to retrieve challenge from localStorage", error);
        return null;
    }
};

// Function to clear a challenge from storage after it's been used
export const clearChallenge = (id: string): void => {
    if (typeof window === 'undefined') return;
    try {
        const challenges = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
        delete challenges[id];
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
    } catch (error) {
        console.error("Failed to clear challenge from localStorage", error);
    }
}
