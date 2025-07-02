import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { UserCard } from '../../components/user/UserCard';
import { LegacyUser } from '../../types';

const mockUser: LegacyUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  isActive: true,
};

describe('UserCard', () => {
  it('should render user information correctly', () => {
    const { getByText } = render(<UserCard user={mockUser} />);

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('john@example.com')).toBeTruthy();
    expect(getByText('Status: Active')).toBeTruthy();
  });

  it('should call onEdit when edit button is pressed', () => {
    const mockOnEdit = jest.fn();
    const { getByText } = render(
      <UserCard user={mockUser} onEdit={mockOnEdit} />
    );

    fireEvent.press(getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });

  it('should call onDelete when delete button is pressed', () => {
    const mockOnDelete = jest.fn();
    const { getByText } = render(
      <UserCard user={mockUser} onDelete={mockOnDelete} />
    );

    fireEvent.press(getByText('Delete'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockUser);
  });

  it('should call onToggleStatus when toggle button is pressed', () => {
    const mockOnToggleStatus = jest.fn();
    const { getByText } = render(
      <UserCard user={mockUser} onToggleStatus={mockOnToggleStatus} />
    );

    fireEvent.press(getByText('Deactivate'));
    expect(mockOnToggleStatus).toHaveBeenCalledWith(mockUser);
  });

  it('should show Activate button for inactive users', () => {
    const inactiveUser = { ...mockUser, isActive: false };
    const { getByText } = render(
      <UserCard user={inactiveUser} onToggleStatus={jest.fn()} />
    );

    expect(getByText('Activate')).toBeTruthy();
    expect(getByText('Status: Inactive')).toBeTruthy();
  });

  it('should not render action buttons when handlers are not provided', () => {
    const { queryByText } = render(<UserCard user={mockUser} />);

    expect(queryByText('Edit')).toBeNull();
    expect(queryByText('Delete')).toBeNull();
    expect(queryByText('Deactivate')).toBeNull();
  });
});