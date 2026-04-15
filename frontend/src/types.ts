// Core user type returned from the backend (never includes passwordHash)
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Shape of the decoded JWT payload
export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

// Dashboard stat card
export interface StatCard {
  label: string;
  value: string;
  unit: string;
  trend: string;
  trendUp: boolean;
  icon: string;
}

// Recent activity item
export interface ActivityItem {
  id: string;
  description: string;
  timestamp: string;
}
