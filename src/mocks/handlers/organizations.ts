
import { http, HttpResponse } from 'msw';
import { organizations, memberships } from '../data';

// Organization-related handlers
export const organizationHandlers = [
  // Organizations endpoints
  http.get('/api/organizations', () => {
    console.log("MSW: Organizations request intercepted");
    const authData = localStorage.getItem('auth');
    
    if (!authData) {
      return new HttpResponse(
        JSON.stringify(null),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    try {
      const { user } = JSON.parse(authData);
      const userMemberships = memberships.filter(m => m.userId === user.id);
      const userOrgs = userMemberships.map(membership => {
        const org = organizations.find(o => o.id === membership.organizationId);
        return { ...org, role: membership.role };
      });
      
      return new HttpResponse(
        JSON.stringify(userOrgs),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error in organizations endpoint:', error);
      return new HttpResponse(
        JSON.stringify({ error: 'Server error' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }),
  
  // Also handle absolute URL path
  http.get('https://*.lovable.app/api/organizations', () => {
    console.log("MSW: Organizations request intercepted (absolute URL)");
    const authData = localStorage.getItem('auth');
    
    if (!authData) {
      return new HttpResponse(
        JSON.stringify(null),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    try {
      const { user } = JSON.parse(authData);
      const userMemberships = memberships.filter(m => m.userId === user.id);
      const userOrgs = userMemberships.map(membership => {
        const org = organizations.find(o => o.id === membership.organizationId);
        return { ...org, role: membership.role };
      });
      
      return new HttpResponse(
        JSON.stringify(userOrgs),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error in organizations endpoint:', error);
      return new HttpResponse(
        JSON.stringify({ error: 'Server error' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }),
];
