import { makeObservable, observable, action, computed } from "mobx";
import BooksStore from "./Books.store";

class BooksController {
  store;
  newBookName = "";
  newBookAuthor = "";

  constructor(store) {
    this.store = store;
    makeObservable(this, {
      newBookName: observable,
      newBookAuthor: observable,
      setNewBookName: action,
      setNewBookAuthor: action,
      handleAddBook: action,
      resetForm: action,
      switchToAllBooks: action,
      switchToPrivateBooks: action,
      isFormValid: computed
    });
  }

  setNewBookName = (name) => {
    this.newBookName = name;
  };

  setNewBookAuthor = (author) => {
    this.newBookAuthor = author;
  };

  handleAddBook = async () => {
    if (!this.isFormValid) return;
    
    await this.store.addBook(this.newBookName, this.newBookAuthor);
    this.resetForm();
  };

  resetForm = () => {
    this.newBookName = "";
    this.newBookAuthor = "";
  };

  switchToAllBooks = () => {
    this.store.uiStore.setBooksFilter("all");
  };

  switchToPrivateBooks = () => {
    this.store.uiStore.setBooksFilter("private");
  };

  get isFormValid() {
    return this.newBookName.trim() !== "" && this.newBookAuthor.trim() !== "";
  }

  get books() {
    return this.store.filteredBooks;
  }

  get isLoading() {
    return this.store.isLoading;
  }

  get error() {
    return this.store.error;
  }

  get booksCount() {
    return this.store.filteredBooks.length;
  }

  get isAllBooksSelected() {
    return this.store.uiStore.isAllBooksSelected;
  }

  get isPrivateBooksSelected() {
    return this.store.uiStore.isPrivateBooksSelected;
  }

  get privateBooksCount() {
    return this.store.uiStore.privateBooksCount;
  }
}

export default BooksController; 