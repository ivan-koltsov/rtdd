import BooksStore from '../Books.store';
import BooksRepository from '../Books.repository';
import UIStore from '../../Shared/UI.store';

// Mock the repository
jest.mock('../Books.repository');

describe('BooksStore', () => {
  let store;
  let mockRepository;
  let uiStore;

  beforeEach(() => {
    // Create a mock repository instance
    mockRepository = {
      getBooks: jest.fn(),
      addBook: jest.fn()
    };
    
    // Mock the constructor to return our mock instance
    BooksRepository.mockImplementation(() => mockRepository);
    
    uiStore = new UIStore();
    store = new BooksStore(uiStore);
    jest.clearAllMocks();
  });

  describe('loadBooks', () => {
    it('should load books successfully', async () => {
      const mockBooks = [
        { name: 'Test Book 1', author: 'Author 1', ownerId: 'postnikov' },
        { name: 'Test Book 2', author: 'Author 2', ownerId: 'other' }
      ];
      
      mockRepository.getBooks.mockResolvedValue(mockBooks);

      await store.loadBooks();

      expect(store.books).toEqual(mockBooks);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(null);
      expect(mockRepository.getBooks).toHaveBeenCalledTimes(1);
    });

    it('should update private books count in UI store after loading', async () => {
      const mockBooks = [
        { name: 'Test Book 1', author: 'Author 1', ownerId: 'postnikov' },
        { name: 'Test Book 2', author: 'Author 2', ownerId: 'other' },
        { name: 'Test Book 3', author: 'Author 3', ownerId: 'postnikov' }
      ];
      
      mockRepository.getBooks.mockResolvedValue(mockBooks);

      await store.loadBooks();

      expect(uiStore.privateBooksCount).toBe(2);
    });

    it('should handle errors when loading books', async () => {
      const errorMessage = 'Failed to fetch books';
      mockRepository.getBooks.mockRejectedValue(new Error(errorMessage));

      await store.loadBooks();

      expect(store.books).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(errorMessage);
    });

    it('should set loading state correctly', async () => {
      mockRepository.getBooks.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve([]), 100))
      );

      const loadPromise = store.loadBooks();
      
      expect(store.isLoading).toBe(true);
      expect(store.error).toBe(null);

      await loadPromise;
      
      expect(store.isLoading).toBe(false);
    });
  });

  describe('addBook', () => {
    it('should add book successfully and reload books', async () => {
      const mockBooks = [
        { name: 'Test Book 1', author: 'Author 1', ownerId: 'postnikov' },
        { name: 'New Book', author: 'New Author', ownerId: 'postnikov' }
      ];
      
      mockRepository.addBook.mockResolvedValue(true);
      mockRepository.getBooks.mockResolvedValue(mockBooks);

      await store.addBook('New Book', 'New Author');

      expect(mockRepository.addBook).toHaveBeenCalledWith({
        name: 'New Book',
        author: 'New Author'
      });
      expect(mockRepository.getBooks).toHaveBeenCalledTimes(1);
      expect(store.books).toEqual(mockBooks);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(null);
    });

    it('should handle failed book addition', async () => {
      mockRepository.addBook.mockResolvedValue(false);

      await store.addBook('New Book', 'New Author');

      expect(store.error).toBe('Failed to add book');
      expect(store.isLoading).toBe(false);
      expect(mockRepository.getBooks).not.toHaveBeenCalled();
    });

    it('should handle errors when adding book', async () => {
      const errorMessage = 'Network error';
      mockRepository.addBook.mockRejectedValue(new Error(errorMessage));

      await store.addBook('New Book', 'New Author');

      expect(store.error).toBe(errorMessage);
      expect(store.isLoading).toBe(false);
    });
  });

  describe('filteredBooks', () => {
    beforeEach(async () => {
      const mockBooks = [
        { name: 'Private Book 1', author: 'Author 1', ownerId: 'postnikov' },
        { name: 'Public Book 1', author: 'Author 2', ownerId: 'other' },
        { name: 'Private Book 2', author: 'Author 3', ownerId: 'postnikov' }
      ];
      
      mockRepository.getBooks.mockResolvedValue(mockBooks);
      await store.loadBooks();
    });

    it('should return all books when filter is set to "all"', () => {
      uiStore.setBooksFilter('all');
      expect(store.filteredBooks).toHaveLength(3);
    });

    it('should return only private books when filter is set to "private"', () => {
      uiStore.setBooksFilter('private');
      expect(store.filteredBooks).toHaveLength(2);
      expect(store.filteredBooks.every(book => book.ownerId === 'postnikov')).toBe(true);
    });

    it('should update filtered books when filter changes', () => {
      // Initially show all books
      uiStore.setBooksFilter('all');
      expect(store.filteredBooks).toHaveLength(3);

      // Switch to private books
      uiStore.setBooksFilter('private');
      expect(store.filteredBooks).toHaveLength(2);

      // Switch back to all books
      uiStore.setBooksFilter('all');
      expect(store.filteredBooks).toHaveLength(3);
    });
  });

  describe('privateBooksCount', () => {
    it('should return correct count of private books', async () => {
      const mockBooks = [
        { name: 'Private Book 1', author: 'Author 1', ownerId: 'postnikov' },
        { name: 'Public Book 1', author: 'Author 2', ownerId: 'other' },
        { name: 'Private Book 2', author: 'Author 3', ownerId: 'postnikov' },
        { name: 'Public Book 2', author: 'Author 4', ownerId: 'another' }
      ];
      
      mockRepository.getBooks.mockResolvedValue(mockBooks);
      await store.loadBooks();

      expect(store.privateBooksCount).toBe(2);
    });

    it('should return 0 when no private books exist', async () => {
      const mockBooks = [
        { name: 'Public Book 1', author: 'Author 1', ownerId: 'other' },
        { name: 'Public Book 2', author: 'Author 2', ownerId: 'another' }
      ];
      
      mockRepository.getBooks.mockResolvedValue(mockBooks);
      await store.loadBooks();

      expect(store.privateBooksCount).toBe(0);
    });
  });

  describe('error handling', () => {
    it('should set error correctly', () => {
      const errorMessage = 'Test error';
      store.setError(errorMessage);
      expect(store.error).toBe(errorMessage);
    });

    it('should clear error correctly', () => {
      store.setError('Test error');
      store.clearError();
      expect(store.error).toBe(null);
    });

    it('should clear error when starting new operations', async () => {
      store.setError('Previous error');
      mockRepository.getBooks.mockResolvedValue([]);

      await store.loadBooks();

      expect(store.error).toBe(null);
    });
  });

  describe('computed properties', () => {
    it('should return correct books count', () => {
      store.books = [
        { name: 'Book 1', author: 'Author 1', ownerId: 'postnikov' },
        { name: 'Book 2', author: 'Author 2', ownerId: 'other' },
        { name: 'Book 3', author: 'Author 3', ownerId: 'postnikov' }
      ];

      expect(store.booksCount).toBe(3);
    });

    it('should return 0 for empty books array', () => {
      store.books = [];
      expect(store.booksCount).toBe(0);
    });
  });
}); 