import { render, screen } from '@testing-library/react';
import App from './App';
import { PanelProvider } from './PanelContext'; // Import the provider

describe('App', () => {
  it('renders LLM Deck title', () => {
    render(
      <PanelProvider> {/* Wrap App with the provider */}
        <App />
      </PanelProvider>
    );
    expect(screen.getByText(/LLM Deck/i)).toBeInTheDocument();
  });
});
