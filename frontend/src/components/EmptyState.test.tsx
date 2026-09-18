import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the title and optional description', () => {
    render(<EmptyState title="Пока нет новостей" description="Загляните позже" />);

    expect(screen.getByText('Пока нет новостей')).toBeInTheDocument();
    expect(screen.getByText('Загляните позже')).toBeInTheDocument();
  });

  it('omits the description when none is given', () => {
    render(<EmptyState title="Пусто" />);

    expect(screen.getByText('Пусто')).toBeInTheDocument();
    expect(screen.queryByText('Загляните позже')).not.toBeInTheDocument();
  });

  it('calls onAction when the action button is clicked', () => {
    const onAction = vi.fn();
    render(<EmptyState title="Пусто" actionLabel="Обновить" onAction={onAction} />);

    fireEvent.click(screen.getByRole('button', { name: 'Обновить' }));

    expect(onAction).toHaveBeenCalledOnce();
  });
});
