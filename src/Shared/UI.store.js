import { makeObservable, observable, action, computed } from "mobx";

class UIStore {
  booksFilter = "all"; // "all" or "private"
  privateBooksCount = 0;

  constructor() {
    makeObservable(this, {
      booksFilter: observable,
      privateBooksCount: observable,
      setBooksFilter: action,
      setPrivateBooksCount: action,
      isAllBooksSelected: computed,
      isPrivateBooksSelected: computed
    });
  }

  setBooksFilter = (filter) => {
    this.booksFilter = filter;
  };

  setPrivateBooksCount = (count) => {
    this.privateBooksCount = count;
  };

  get isAllBooksSelected() {
    return this.booksFilter === "all";
  }

  get isPrivateBooksSelected() {
    return this.booksFilter === "private";
  }
}

export default UIStore; 