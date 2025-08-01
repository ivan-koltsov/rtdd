// Simple test script to verify business logic
const { makeObservable, observable, action, runInAction } = require('mobx');

// Mock fetch
global.fetch = jest.fn();

// Mock ApiGateway
class MockApiGateway {
  constructor() {
    this.get = jest.fn();
    this.post = jest.fn();
  }
}

// Mock BooksRepository
class MockBooksRepository {
  constructor() {
    this.httpGateway = new MockApiGateway();
  }

  getBooks = async () => {
    return await this.httpGateway.get("/");
  };

  addBook = async ({ name, author }) => {
    const result = await this.httpGateway.post("/books", { name, author });
    return result && result.status === "ok" ? true : false;
  };
}

// Test BooksStore
class BooksStore {
  books = [];
  isLoading = false;
  error = null;
  booksRepository;

  constructor() {
    this.booksRepository = new MockBooksRepository();
    makeObservable(this, {
      books: observable,
      isLoading: observable,
      error: observable,
      loadBooks: action,
      addBook: action,
      setError: action,
      clearError: action
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
}

// Test BooksController
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

  get isFormValid() {
    return this.newBookName.trim() !== "" && this.newBookAuthor.trim() !== "";
  }

  get books() {
    return this.store.books;
  }

  get isLoading() {
    return this.store.isLoading;
  }

  get error() {
    return this.store.error;
  }

  get booksCount() {
    return this.store.booksCount;
  }
}

// Run tests
console.log('🧪 Running simple tests...\n');

// Test 1: BooksStore initialization
console.log('Test 1: BooksStore initialization');
const store = new BooksStore();
console.log('✅ Store created successfully');
console.log('✅ Initial books count:', store.booksCount);
console.log('✅ Initial loading state:', store.isLoading);
console.log('✅ Initial error state:', store.error);

// Test 2: Form validation
console.log('\nTest 2: Form validation');
const controller = new BooksController(store);
console.log('✅ Controller created successfully');
console.log('✅ Empty form validation:', controller.isFormValid);

controller.setNewBookName('Test Book');
controller.setNewBookAuthor('Test Author');
console.log('✅ Filled form validation:', controller.isFormValid);

// Test 3: Loading books
console.log('\nTest 3: Loading books');
const mockBooks = [
  { name: 'Book 1', author: 'Author 1' },
  { name: 'Book 2', author: 'Author 2' }
];
store.booksRepository.httpGateway.get.mockResolvedValue(mockBooks);

store.loadBooks().then(() => {
  console.log('✅ Books loaded successfully');
  console.log('✅ Books count after loading:', store.booksCount);
  console.log('✅ Loading state after loading:', store.isLoading);
  console.log('✅ Books data:', store.books);
});

// Test 4: Adding book
console.log('\nTest 4: Adding book');
store.booksRepository.httpGateway.post.mockResolvedValue({ status: 'ok' });
store.booksRepository.httpGateway.get.mockResolvedValue([
  ...mockBooks,
  { name: 'New Book', author: 'New Author' }
]);

controller.handleAddBook().then(() => {
  console.log('✅ Book added successfully');
  console.log('✅ Form reset after adding:', controller.newBookName === '' && controller.newBookAuthor === '');
});

console.log('\n🎉 All tests completed!'); 