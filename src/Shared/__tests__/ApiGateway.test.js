import ApiGateway from '../ApiGateway';

// Mock fetch globally
global.fetch = jest.fn();

describe('ApiGateway', () => {
  let apiGateway;

  beforeEach(() => {
    apiGateway = new ApiGateway();
    fetch.mockClear();
  });

  describe('get', () => {
    it('should make successful GET request', async () => {
      const mockResponse = { name: 'Test Book', author: 'Test Author' };
      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse)
      };
      
      fetch.mockResolvedValue(mockFetchResponse);

      const result = await apiGateway.get('/test');

      expect(fetch).toHaveBeenCalledWith('https://tdd.demo.reaktivate.com/v1/books/postnikov/test');
      expect(mockFetchResponse.json).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should handle HTTP error responses', async () => {
      const mockFetchResponse = {
        ok: false,
        status: 404
      };
      
      fetch.mockResolvedValue(mockFetchResponse);

      await expect(apiGateway.get('/test')).rejects.toThrow('HTTP error! status: 404');
      expect(fetch).toHaveBeenCalledWith('https://tdd.demo.reaktivate.com/v1/books/postnikov/test');
    });

    it('should handle network errors', async () => {
      const errorMessage = 'Network error';
      fetch.mockRejectedValue(new Error(errorMessage));

      await expect(apiGateway.get('/test')).rejects.toThrow(errorMessage);
    });
  });

  describe('post', () => {
    it('should make successful POST request', async () => {
      const payload = { name: 'New Book', author: 'New Author' };
      const mockResponse = { status: 'ok' };
      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse)
      };
      
      fetch.mockResolvedValue(mockFetchResponse);

      const result = await apiGateway.post('/books', payload);

      expect(fetch).toHaveBeenCalledWith(
        'https://tdd.demo.reaktivate.com/v1/books/postnikov/books',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );
      expect(mockFetchResponse.json).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should handle HTTP error responses', async () => {
      const payload = { name: 'New Book', author: 'New Author' };
      const mockFetchResponse = {
        ok: false,
        status: 500
      };
      
      fetch.mockResolvedValue(mockFetchResponse);

      await expect(apiGateway.post('/books', payload)).rejects.toThrow('HTTP error! status: 500');
    });

    it('should handle network errors', async () => {
      const payload = { name: 'New Book', author: 'New Author' };
      const errorMessage = 'Network error';
      fetch.mockRejectedValue(new Error(errorMessage));

      await expect(apiGateway.post('/books', payload)).rejects.toThrow(errorMessage);
    });

    it('should properly serialize payload to JSON', async () => {
      const payload = { name: 'New Book', author: 'New Author' };
      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({})
      };
      
      fetch.mockResolvedValue(mockFetchResponse);

      await apiGateway.post('/books', payload);

      expect(fetch).toHaveBeenCalledWith(
        'https://tdd.demo.reaktivate.com/v1/books/postnikov/books',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );
    });
  });
}); 