import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PayrollExceptionsQueue from '@/components/features/payroll/PayrollExceptionsQueue';

describe('PayrollExceptionsQueue', () => {
  it('renders the section heading', () => {
    render(<PayrollExceptionsQueue />);
    expect(
      screen.getByRole('region', { name: /payroll exceptions/i }),
    ).toBeInTheDocument();
  });

  it('renders exception items from mock data', () => {
    render(<PayrollExceptionsQueue />);
    // At least one pending/failed tx from MOCK_TRANSACTIONS
    const items = screen.queryAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
  });

  it('shows reason code for each exception', () => {
    render(<PayrollExceptionsQueue />);
    expect(screen.getAllByText(/reason:/i).length).toBeGreaterThan(0);
  });

  it('shows next step for each exception', () => {
    render(<PayrollExceptionsQueue />);
    expect(screen.getAllByText(/payroll wizard/i).length).toBeGreaterThan(0);
  });

  it('shows pending badge for pending transactions', () => {
    render(<PayrollExceptionsQueue />);
    expect(screen.getAllByText(/pending/i).length).toBeGreaterThan(0);
  });

  it('shows count badge in heading', () => {
    render(<PayrollExceptionsQueue />);
    const badge = screen.getByText(/^\d+$/);
    expect(Number(badge.textContent)).toBeGreaterThan(0);
  });

  it('renders link to payroll wizard for each item', () => {
    render(<PayrollExceptionsQueue />);
    const links = screen.getAllByRole('link', { name: /go to payroll wizard/i });
    expect(links.length).toBeGreaterThan(0);
    links.forEach((l) => expect(l).toHaveAttribute('href', '/payroll'));
  });

  it('renders exception list with accessible label', () => {
    render(<PayrollExceptionsQueue />);
    expect(screen.getByRole('list', { name: /exceptions queue/i })).toBeInTheDocument();
  });
});
