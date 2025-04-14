
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConfigDialog } from './ConfigDialog';
import type { llmProvider } from './llm/llm'; // Adjust path if necessary

// Mock llmProviders data
const mockLlmProviders: llmProvider[] = [
  {
    id: 'test-llm-1',
    name: 'Test LLM 1',
    apiKeyLabel: 'Test API Key 1',
    localApiKey: '',
    create: vi.fn(), // Mock 'create' method if needed by the component
  },
];

describe('ConfigDialog', () => {
  const mockOnClose = vi.fn();
  let setItemSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Spy on localStorage.setItem before each test
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    // Mock getItem to return empty string initially or specific values if needed
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('');
  });

  afterEach(() => {
    // Clear mocks and restore original implementation after each test
    vi.restoreAllMocks();
  });

  it('should save LLM API key changes to localStorage', () => {
    render(
      <ConfigDialog
        open={true} // Ensure the dialog is open
        llmProviders={mockLlmProviders}
        onClose={mockOnClose}
      />
    );

    const apiKeyInput = screen.getByLabelText('Test API Key 1') as HTMLInputElement;
    const newApiKey = 'new-test-api-key-123';

    // Simulate user typing into the API key field
    fireEvent.change(apiKeyInput, { target: { value: newApiKey } });

    // Check if localStorage.setItem was called correctly
    // Key format is `llmdeck-${group}-${name}` -> 'llmdeck-config-test-llm-1'
    expect(setItemSpy).toHaveBeenCalledWith('llmdeck-config-test-llm-1', newApiKey);
  });

  it('should save Polly credential changes to localStorage', () => {
    render(
      <ConfigDialog
        open={true}
        llmProviders={mockLlmProviders} // Provide mock providers even if not testing them directly
        onClose={mockOnClose}
      />
    );

    const pollyInput = screen.getByLabelText('REGION:ACCESS_KEY_ID:SECRET_ACCESS_KEY') as HTMLInputElement;
    const newPollyCredentials = 'test-region:test-key-id:test-secret-key';

    // Simulate user typing into the Polly credentials field
    fireEvent.change(pollyInput, { target: { value: newPollyCredentials } });

    // Check if localStorage.setItem was called correctly
    // Key format is `llmdeck-${group}-${name}` -> 'llmdeck-config-polly'
    expect(setItemSpy).toHaveBeenCalledWith('llmdeck-config-polly', newPollyCredentials);
  });

    it('should save Polly Voice ID (JP) changes to localStorage', () => {
        render(
        <ConfigDialog
            open={true}
            llmProviders={mockLlmProviders}
            onClose={mockOnClose}
        />
        );

        // Find the select input by its implicit label (MUI specific)
        const voiceSelectInput = screen.getByLabelText('VoiceID:JP');

        // Click the select to open the dropdown options
        fireEvent.mouseDown(voiceSelectInput);

        // Find and click the desired option (e.g., 'Kazuha')
        // Note: The options might not be immediately available, need to query within the body/popover
        const option = screen.getByRole('option', { name: /Kazuha/i }); // Adjust regex as needed based on actual text
        fireEvent.click(option);

        // Check if localStorage.setItem was called correctly for voice change
        expect(setItemSpy).toHaveBeenCalledWith('llmdeck-config-polly-voice-jp', 'Kazuha');
    });

    it('should save Polly Voice ID (EN) changes to localStorage', () => {
        render(
          <ConfigDialog
            open={true}
            llmProviders={mockLlmProviders}
            onClose={mockOnClose}
          />
        );

        // Find the select input by its implicit label
        const voiceSelectInput = screen.getByLabelText('VoiceID:EN');

        // Click the select to open the dropdown options
        fireEvent.mouseDown(voiceSelectInput);

        // Find and click the desired option (e.g., 'Matthew')
        const option = screen.getByRole('option', { name: /Matthew/i }); // Adjust regex as needed
        fireEvent.click(option);

        // Check if localStorage.setItem was called correctly for voice change
        expect(setItemSpy).toHaveBeenCalledWith('llmdeck-config-polly-voice-en', 'Matthew');
      });
});
