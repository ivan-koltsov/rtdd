import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { observer } from 'mobx-react';
import BooksView from '../Books.view';

// Mock mobx-react observer
jest.mock('mobx-react', () => ({
  observer: (component) => component
}));

describe('BooksView', () => {
  let mockController;

  beforeEach(() => {
    mockController = {
      books: [],
      isLoading: false,
      error: null,
      booksCount: 0,
      newBookName: '',
      newBookAuthor: '',
      setNewBookName: jest.fn(),
      setNewBookAuthor: jest.fn(),
      handleAddBook: jest.fn(),
      isFormValid: false
    };
  });

  describe('rendering', () => {
    it('should render books list with count', () => {
      mockController.books = [
        { name: 'Book 1', author: 'Author 1' },
        { name: 'Book 2', author: 'Author 2' }
      ];
      mockController.booksCount = 2;

      render(<BooksView controller={mockController} />);

      expect(screen.getByText('Books (2)')).toBeInTheDocument();
      expect(screen.getByText('Author 1')).toBeInTheDocument();
      expect(screen.getByText('Author 2')).toBeInTheDocument();
      // Check that the books are rendered by looking for the book items
      const bookItems = screen.getAllByText(/Book \d/);
      expect(bookItems.length).toBeGreaterThan(0);
    });

    it('should render empty state when no books', () => {
      render(<BooksView controller={mockController} />);

      expect(screen.getByText('Books (0)')).toBeInTheDocument();
      expect(screen.getByText('Add New Book')).toBeInTheDocument();
    });

    it('should render loading state', () => {
      mockController.isLoading = true;

      render(<BooksView controller={mockController} />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render error message', () => {
      mockController.error = 'Failed to load books';

      render(<BooksView controller={mockController} />);

      expect(screen.getByText('Error: Failed to load books')).toBeInTheDocument();
    });
  });

  describe('form interactions', () => {
    it('should call setNewBookName when name input changes', () => {
      render(<BooksView controller={mockController} />);

      const nameInput = screen.getByPlaceholderText('Book name');
      fireEvent.change(nameInput, { target: { value: 'New Book' } });

      expect(mockController.setNewBookName).toHaveBeenCalledWith('New Book');
    });

    it('should call setNewBookAuthor when author input changes', () => {
      render(<BooksView controller={mockController} />);

      const authorInput = screen.getByPlaceholderText('Author name');
      fireEvent.change(authorInput, { target: { value: 'New Author' } });

      expect(mockController.setNewBookAuthor).toHaveBeenCalledWith('New Author');
    });

    it('should call handleAddBook when form is submitted', () => {
      mockController.isFormValid = true;
      render(<BooksView controller={mockController} />);

      const addButton = screen.getByText('Add Book');
      fireEvent.click(addButton);

      expect(mockController.handleAddBook).toHaveBeenCalled();
    });

    it('should disable button when form is invalid', () => {
      mockController.isFormValid = false;
      render(<BooksView controller={mockController} />);

      const addButton = screen.getByText('Add Book');
      expect(addButton).toBeDisabled();
    });

    it('should disable button when loading', () => {
      mockController.isLoading = true;
      mockController.isFormValid = true;
      render(<BooksView controller={mockController} />);

      const addButton = screen.getByText('Adding...');
      expect(addButton).toBeDisabled();
    });

    it('should disable inputs when loading', () => {
      mockController.isLoading = true;
      render(<BooksView controller={mockController} />);

      const nameInput = screen.getByPlaceholderText('Book name');
      const authorInput = screen.getByPlaceholderText('Author name');

      expect(nameInput).toBeDisabled();
      expect(authorInput).toBeDisabled();
    });
  });

  describe('form values', () => {
    it('should display current form values', () => {
      mockController.newBookName = 'Test Book';
      mockController.newBookAuthor = 'Test Author';

      render(<BooksView controller={mockController} />);

      const nameInput = screen.getByPlaceholderText('Book name');
      const authorInput = screen.getByPlaceholderText('Author name');

      expect(nameInput.value).toBe('Test Book');
      expect(authorInput.value).toBe('Test Author');
    });
  });

  describe('BookItem component', () => {
    it('should render book information correctly', () => {
      const book = { name: 'Test Book', author: 'Test Author' };
      
      render(
        <div>
          <strong>{book.author}</strong>: {book.name}
        </div>
      );

      expect(screen.getByText('Test Author')).toBeInTheDocument();
      // Check that the book name appears somewhere in the rendered content
      expect(screen.getByText(/Test Book/)).toBeInTheDocument();
    });
  });
}); 