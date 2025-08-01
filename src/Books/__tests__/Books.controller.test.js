import BooksController from '../Books.controller';
import BooksStore from '../Books.store';

// Mock the store
jest.mock('../Books.store');

describe('BooksController', () => {
  let controller;
  let mockStore;

  beforeEach(() => {
    mockStore = {
      books: [],
      isLoading: false,
      error: null,
      booksCount: 0,
      loadBooks: jest.fn(),
      addBook: jest.fn()
    };
    controller = new BooksController(mockStore);
  });

  describe('form state management', () => {
    it('should set new book name correctly', () => {
      controller.setNewBookName('Test Book');
      expect(controller.newBookName).toBe('Test Book');
    });

    it('should set new book author correctly', () => {
      controller.setNewBookAuthor('Test Author');
      expect(controller.newBookAuthor).toBe('Test Author');
    });

    it('should reset form correctly', () => {
      controller.setNewBookName('Test Book');
      controller.setNewBookAuthor('Test Author');
      
      controller.resetForm();
      
      expect(controller.newBookName).toBe('');
      expect(controller.newBookAuthor).toBe('');
    });
  });

  describe('form validation', () => {
    it('should return true for valid form', () => {
      controller.setNewBookName('Test Book');
      controller.setNewBookAuthor('Test Author');
      
      expect(controller.isFormValid).toBe(true);
    });

    it('should return false for empty name', () => {
      controller.setNewBookName('');
      controller.setNewBookAuthor('Test Author');
      
      expect(controller.isFormValid).toBe(false);
    });

    it('should return false for empty author', () => {
      controller.setNewBookName('Test Book');
      controller.setNewBookAuthor('');
      
      expect(controller.isFormValid).toBe(false);
    });

    it('should return false for whitespace-only values', () => {
      controller.setNewBookName('   ');
      controller.setNewBookAuthor('   ');
      
      expect(controller.isFormValid).toBe(false);
    });

    it('should return false for both empty values', () => {
      controller.setNewBookName('');
      controller.setNewBookAuthor('');
      
      expect(controller.isFormValid).toBe(false);
    });
  });

  describe('handleAddBook', () => {
    it('should call store addBook when form is valid', async () => {
      controller.setNewBookName('Test Book');
      controller.setNewBookAuthor('Test Author');
      mockStore.addBook.mockResolvedValue();

      await controller.handleAddBook();

      expect(mockStore.addBook).toHaveBeenCalledWith('Test Book', 'Test Author');
    });

    it('should not call store addBook when form is invalid', async () => {
      controller.setNewBookName('');
      controller.setNewBookAuthor('Test Author');

      await controller.handleAddBook();

      expect(mockStore.addBook).not.toHaveBeenCalled();
    });

    it('should reset form after successful book addition', async () => {
      controller.setNewBookName('Test Book');
      controller.setNewBookAuthor('Test Author');
      mockStore.addBook.mockResolvedValue();

      await controller.handleAddBook();

      expect(controller.newBookName).toBe('');
      expect(controller.newBookAuthor).toBe('');
    });
  });

  describe('store property accessors', () => {
    it('should return books from store', () => {
      const mockBooks = [
        { name: 'Book 1', author: 'Author 1' },
        { name: 'Book 2', author: 'Author 2' }
      ];
      mockStore.books = mockBooks;

      expect(controller.books).toEqual(mockBooks);
    });

    it('should return loading state from store', () => {
      mockStore.isLoading = true;
      expect(controller.isLoading).toBe(true);

      mockStore.isLoading = false;
      expect(controller.isLoading).toBe(false);
    });

    it('should return error from store', () => {
      const errorMessage = 'Test error';
      mockStore.error = errorMessage;
      expect(controller.error).toBe(errorMessage);
    });

    it('should return books count from store', () => {
      mockStore.booksCount = 5;
      expect(controller.booksCount).toBe(5);
    });
  });

  describe('integration with store', () => {
    it('should properly delegate addBook call to store', async () => {
      controller.setNewBookName('New Book');
      controller.setNewBookAuthor('New Author');
      mockStore.addBook.mockResolvedValue();

      await controller.handleAddBook();

      expect(mockStore.addBook).toHaveBeenCalledWith('New Book', 'New Author');
    });
  });
}); 