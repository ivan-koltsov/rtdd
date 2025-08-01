import { makeObservable, observable, action, runInAction, computed } from "mobx";
import BooksRepository from "./Books.repository";

class BooksStore {
  books = [];
  isLoading = false;
  error = null;
  booksRepository;
  uiStore;

  constructor(uiStore) {
    this.uiStore = uiStore;
    this.booksRepository = new BooksRepository();
    makeObservable(this, {
      books: observable,
      isLoading: observable,
      error: observable,
      loadBooks: action,
      addBook: action,
      setError: action,
      clearError: action,
      filteredBooks: computed,
      privateBooksCount: computed
    });
  }

  loadBooks = async () => {
    this.isLoading = true;
    this.clearError();
    
    try {
      const books = await this.booksRepository.getBooks();
      runInAction(() => {
        this.books = books;
        this.isLoading = false;
        // Update private books count in UI store
        this.uiStore.setPrivateBooksCount(this.privateBooksCount);
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.isLoading = false;
      });
    }
  };

  addBook = async (name, author) => {
    this.isLoading = true;
    this.clearError();
    
    try {
      const success = await this.booksRepository.addBook({ name, author });
      if (success) {
        // Reload books after successful addition
        await this.loadBooks();
      } else {
        runInAction(() => {
          this.error = "Failed to add book";
          this.isLoading = false;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.isLoading = false;
      });
    }
  };

  setError = (error) => {
    this.error = error;
  };

  clearError = () => {
    this.error = null;
  };

  get booksCount() {
    return this.books.length;
  }

  get filteredBooks() {
    if (this.uiStore.isAllBooksSelected) {
      return this.books;
    } else {
      // Filter for private books (books owned by the current user)
      return this.books.filter(book => book.ownerId === "postnikov");
    }
  }

  get privateBooksCount() {
    return this.books.filter(book => book.ownerId === "postnikov").length;
  }
}

export default BooksStore; 