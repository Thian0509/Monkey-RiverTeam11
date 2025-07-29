/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('axios'); // Mock axios module BEFORE import

import type { Mock } from 'vitest';
import axios from 'axios';

const mockedAxiosGet = axios.get as Mock; 

import TravelRisk from '../pages/TravelRisk';

// Mock useAuth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    token: 'fake-token',
    user: { name: 'Alice', email: 'alice@example.com' },
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Mock PrimeReact components used in the component
vi.mock('primereact/toast', () => ({ Toast: () => <div data-testid="toast" /> }));
vi.mock('primereact/confirmdialog', () => ({ ConfirmDialog: () => <div data-testid="confirm-dialog" /> }));

const renderPage = () =>
  render(
    <MemoryRouter>
      <TravelRisk />
    </MemoryRouter>
  );

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      features: [
        {
          type: 'Feature',
          properties: {
            name: 'France',
            name_long: 'French Republic',
          },
          geometry: {},
        },
      ],
    }),
  }) as unknown as typeof fetch;

  vi.clearAllMocks();
});

describe('TravelRisk Page', () => {
  it('shows loading initially', async () => {
    mockedAxiosGet.mockResolvedValueOnce({ data: [] });
    renderPage();
    expect(screen.getByText(/Loading destinations/i)).toBeInTheDocument();
  });

  it('renders a fetched destination', async () => {
    mockedAxiosGet.mockResolvedValueOnce({
      data: [{ _id: '123', location: 'France', riskLevel: 80, lastChecked: '2025-07-29' }],
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('France')).toBeInTheDocument();
      expect(screen.getByText('80')).toBeInTheDocument();
    });
  });

  it('opens the new destination dialog', async () => {
    mockedAxiosGet.mockResolvedValueOnce({ data: [] });
    renderPage();

    const addButton = await screen.findByRole('button', { name: /new destination/i });
    fireEvent.click(addButton);

    expect(await screen.findByText(/new destination/i)).toBeInTheDocument();
  });

  it('shows validation error when saving empty form', async () => {
    mockedAxiosGet.mockResolvedValueOnce({ data: [] });
    renderPage();

    const addButton = await screen.findByRole('button', { name: /new destination/i });
    fireEvent.click(addButton);

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(await screen.findByText(/location is required/i)).toBeInTheDocument();
  });

  it('displays error message when API call fails', async () => {
    mockedAxiosGet.mockRejectedValueOnce({ response: { data: { message: 'Server Error' } } });
    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Server Error/i)).toBeInTheDocument();
    });
  });
});
