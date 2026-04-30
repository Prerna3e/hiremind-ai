const rawUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Remove trailing slash if present
const cleanUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

// Ensure it ends with /api
export const API_BASE_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
