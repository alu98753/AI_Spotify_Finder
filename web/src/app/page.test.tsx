import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home Page UI', () => {
  it('should render the AI Spotify Finder title', () => {
    render(<Home />);
    
    // Check if the main title exists
    expect(screen.getByText(/AI Spotify Finder/i)).toBeDefined();
  });

  it('should render a Login with Spotify link', () => {
    render(<Home />);
    
    // Check if there is a link pointing to the login API
    const loginLink = screen.getByRole('link', { name: /Login with Spotify/i });
    expect(loginLink).toBeDefined();
    expect(loginLink.getAttribute('href')).toBe('/api/auth/login');
  });
});
