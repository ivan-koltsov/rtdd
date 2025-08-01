import BooksController from '../Books.controller';
import BooksStore from '../Books.store';
import UIStore from '../../Shared/UI.store';

// Mock the store
jest.mock('../Books.store');

describe('BooksController', () => {
  let controller;
  let mockStore;
  let mockUIStore;

  beforeEach(() => {
    mockUIStore = {
      booksFilter: 'all',
      privateBooksCount: 0,
      setBooksFilter: jest.fn(),
      setPrivateBooksCount: jest.fn(),
      isAllBooksSelected: true,
      isPrivateBooksSelected: false
    };

    mockStore = {
      books: [],
      filteredBooks: [],
      isLoading: false,
      error: null,
      booksCount: 0,
      privateBooksCount: 0,
      uiStore: mockUIStore,
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

  describe('filter switching', () => {
    it('should switch to all books', () => {
      controller.switchToAllBooks();
      expect(mockUIStore.setBooksFilter).toHaveBeenCalledWith('all');
    });

    it('should switch to private books', () => {
      controller.switchToPrivateBooks();
      expect(mockUIStore.setBooksFilter).toHaveBeenCalledWith('private');
    });
  });

  describe('store property accessors', () => {
    it('should return filtered books from store', () => {
      const mockBooks = [
        { name: 'Book 1', author: 'Author 1', ownerId: 'postnikov' },
        { name: 'Book 2', author: 'Author 2', ownerId: 'other' }
      ];
      mockStore.filteredBooks = mockBooks;

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

    it('should return filtered books count from store', () => {
      mockStore.filteredBooks = [
        { name: 'Book 1', author: 'Author 1' },
        { name: 'Book 2', author: 'Author 2' }
      ];
      expect(controller.booksCount).toBe(2);
    });

    it('should return filter state from UI store', () => {
      mockUIStore.isAllBooksSelected = true;
      mockUIStore.isPrivateBooksSelected = false;
      expect(controller.isAllBooksSelected).toBe(true);
      expect(controller.isPrivateBooksSelected).toBe(false);

      mockUIStore.isAllBooksSelected = false;
      mockUIStore.isPrivateBooksSelected = true;
      expect(controller.isAllBooksSelected).toBe(false);
      expect(controller.isPrivateBooksSelected).toBe(true);
    });

    it('should return private books count from UI store', () => {
      mockUIStore.privateBooksCount = 15;
      expect(controller.privateBooksCount).toBe(15);
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