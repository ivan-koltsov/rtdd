import BooksRepository from '../Books.repository';
import ApiGateway from '../../Shared/ApiGateway';

// Mock the ApiGateway
jest.mock('../../Shared/ApiGateway');

describe('BooksRepository', () => {
  let repository;
  let mockApiGateway;

  beforeEach(() => {
    mockApiGateway = {
      get: jest.fn(),
      post: jest.fn()
    };
    ApiGateway.mockImplementation(() => mockApiGateway);
    repository = new BooksRepository();
  });

  describe('getBooks', () => {
    it('should fetch books successfully', async () => {
      const mockBooks = [
        { name: 'Book 1', author: 'Author 1' },
        { name: 'Book 2', author: 'Author 2' }
      ];
      
      mockApiGateway.get.mockResolvedValue(mockBooks);

      const result = await repository.getBooks();

      expect(result).toEqual(mockBooks);
      expect(mockApiGateway.get).toHaveBeenCalledWith('/');
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Network error';
      mockApiGateway.get.mockRejectedValue(new Error(errorMessage));

      await expect(repository.getBooks()).rejects.toThrow(errorMessage);
      expect(mockApiGateway.get).toHaveBeenCalledWith('/');
    });
  });

  describe('addBook', () => {
    it('should add book successfully', async () => {
      const bookData = { name: 'New Book', author: 'New Author' };
      const mockResponse = { status: 'ok' };
      
      mockApiGateway.post.mockResolvedValue(mockResponse);

      const result = await repository.addBook(bookData);

      expect(result).toBe(true);
      expect(mockApiGateway.post).toHaveBeenCalledWith('/books', bookData);
    });

    it('should return false when API returns non-ok status', async () => {
      const bookData = { name: 'New Book', author: 'New Author' };
      const mockResponse = { status: 'error' };
      
      mockApiGateway.post.mockResolvedValue(mockResponse);

      const result = await repository.addBook(bookData);

      expect(result).toBe(false);
      expect(mockApiGateway.post).toHaveBeenCalledWith('/books', bookData);
    });

    it('should return false when API response is falsy', async () => {
      const bookData = { name: 'New Book', author: 'New Author' };
      
      mockApiGateway.post.mockResolvedValue(null);

      const result = await repository.addBook(bookData);

      expect(result).toBe(false);
      expect(mockApiGateway.post).toHaveBeenCalledWith('/books', bookData);
    });

    it('should handle API errors', async () => {
      const bookData = { name: 'New Book', author: 'New Author' };
      const errorMessage = 'Network error';
      
      mockApiGateway.post.mockRejectedValue(new Error(errorMessage));

      await expect(repository.addBook(bookData)).rejects.toThrow(errorMessage);
      expect(mockApiGateway.post).toHaveBeenCalledWith('/books', bookData);
    });
  });

  describe('ApiGateway initialization', () => {
    it('should create ApiGateway instance in constructor', () => {
      expect(ApiGateway).toHaveBeenCalledTimes(1);
      expect(repository.httpGateway).toBe(mockApiGateway);
    });
  });
}); 