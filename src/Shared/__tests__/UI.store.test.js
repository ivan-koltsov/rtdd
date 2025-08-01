import UIStore from '../UI.store';

describe('UIStore', () => {
  let store;

  beforeEach(() => {
    store = new UIStore();
  });

  describe('booksFilter', () => {
    it('should have default filter set to "all"', () => {
      expect(store.booksFilter).toBe('all');
    });

    it('should set books filter correctly', () => {
      store.setBooksFilter('private');
      expect(store.booksFilter).toBe('private');
    });

    it('should update filter multiple times', () => {
      store.setBooksFilter('private');
      expect(store.booksFilter).toBe('private');

      store.setBooksFilter('all');
      expect(store.booksFilter).toBe('all');
    });
  });

  describe('privateBooksCount', () => {
    it('should have default count set to 0', () => {
      expect(store.privateBooksCount).toBe(0);
    });

    it('should set private books count correctly', () => {
      store.setPrivateBooksCount(15);
      expect(store.privateBooksCount).toBe(15);
    });

    it('should update count multiple times', () => {
      store.setPrivateBooksCount(10);
      expect(store.privateBooksCount).toBe(10);

      store.setPrivateBooksCount(25);
      expect(store.privateBooksCount).toBe(25);
    });
  });

  describe('computed properties', () => {
    it('should return true for isAllBooksSelected when filter is "all"', () => {
      store.setBooksFilter('all');
      expect(store.isAllBooksSelected).toBe(true);
      expect(store.isPrivateBooksSelected).toBe(false);
    });

    it('should return true for isPrivateBooksSelected when filter is "private"', () => {
      store.setBooksFilter('private');
      expect(store.isPrivateBooksSelected).toBe(true);
      expect(store.isAllBooksSelected).toBe(false);
    });

    it('should handle filter changes correctly', () => {
      // Initial state
      expect(store.isAllBooksSelected).toBe(true);
      expect(store.isPrivateBooksSelected).toBe(false);

      // Switch to private
      store.setBooksFilter('private');
      expect(store.isAllBooksSelected).toBe(false);
      expect(store.isPrivateBooksSelected).toBe(true);

      // Switch back to all
      store.setBooksFilter('all');
      expect(store.isAllBooksSelected).toBe(true);
      expect(store.isPrivateBooksSelected).toBe(false);
    });
  });
}); 