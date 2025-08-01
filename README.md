# Fast-Test React Books Application

This is a refactored React application that demonstrates the **fast-test approach** with **flat presentation**, completely separating UI from business logic using the **MVP/MVVM pattern** with **MobX** for state management.

## Architecture Overview

The application follows the **fast-test approach** with the following key principles:

### 1. **Zero Logic in JSX/TSX Files**
- All business logic is moved to controllers and stores
- React components are pure presentation layers
- No calculations or complex logic in view components

### 2. **MVP/MVVM Pattern Implementation**
- **Model**: `BooksStore` (MobX store for state management)
- **View**: `BooksView` (Pure React components)
- **Controller/ViewModel**: `BooksController` (Presentation logic and form handling)

### 3. **MobX Integration**
- State management with MobX observables
- Reactive UI updates with `mobx-react`
- Computed properties for derived state

## Project Structure

```
src/
├── Books/
│   ├── Books.store.js          # MobX store (business logic)
│   ├── Books.controller.js     # Controller/ViewModel (presentation logic)
│   ├── Books.view.js           # Pure React components (UI only)
│   ├── Books.repository.js     # Data access layer
│   └── __tests__/              # Test files
├── Shared/
│   ├── ApiGateway.js           # HTTP client
│   ├── config.js               # Configuration
│   └── __tests__/              # Test files
├── index.js                    # Application entry point
├── styles.css                  # Styling
└── setupTests.js               # Test configuration
```

## Features

- ✅ **Display books list** from API
- ✅ **Add new books** with form validation
- ✅ **Loading states** and error handling
- ✅ **Real-time updates** with MobX reactivity
- ✅ **Comprehensive test coverage** for all business logic

## API Integration

The application integrates with the provided API:
- **Base URL**: `https://tdd.demo.reaktivate.com/v1/books/[user]`
- **Swagger**: `https://tdd.demo.reaktivate.com/api-docs/`

**Note**: The API uses SSL self-signed certificates. You may need to open any API endpoint in your browser first and "allow" the certificate.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

```bash
npm start
```

The application will open at `http://localhost:3000`

### Running Tests

```bash
npm test
```

This will run all tests in watch mode. Press `a` to run all tests or `q` to quit.

## Test Coverage

The application includes comprehensive tests covering:

### Business Logic Tests
- **BooksStore**: State management, API integration, error handling
- **BooksController**: Form validation, presentation logic
- **BooksRepository**: Data access layer, API calls
- **ApiGateway**: HTTP request handling

### UI Tests
- **BooksView**: Component rendering, user interactions
- Form validation and submission
- Loading states and error display

### Test Structure
```
src/
├── Books/__tests__/
│   ├── Books.store.test.js     # Store business logic tests
│   ├── Books.controller.test.js # Controller logic tests
│   ├── Books.repository.test.js # Repository tests
│   └── Books.view.test.js      # UI component tests
└── Shared/__tests__/
    └── ApiGateway.test.js      # HTTP client tests
```

## Architecture Benefits

### 1. **Testability**
- Business logic is completely separated from UI
- All logic can be tested without React components
- Fast unit tests without DOM rendering

### 2. **Maintainability**
- Clear separation of concerns
- Easy to modify business logic without touching UI
- Predictable data flow

### 3. **Reusability**
- Controllers can be reused across different UI frameworks
- Business logic is framework-agnostic
- Easy to swap UI implementations

### 4. **Performance**
- MobX provides efficient reactivity
- Minimal re-renders with precise dependency tracking
- Computed properties for derived state

## Key Implementation Details

### MobX Store (`BooksStore`)
```javascript
class BooksStore {
  @observable books = [];
  @observable isLoading = false;
  @observable error = null;

  @action loadBooks = async () => { /* ... */ };
  @action addBook = async (name, author) => { /* ... */ };
  
  @computed get booksCount() { return this.books.length; }
}
```

### Controller (`BooksController`)
```javascript
class BooksController {
  @observable newBookName = "";
  @observable newBookAuthor = "";
  
  @computed get isFormValid() {
    return this.newBookName.trim() !== "" && this.newBookAuthor.trim() !== "";
  }
  
  @action handleAddBook = async () => { /* ... */ };
}
```

### Pure View (`BooksView`)
```javascript
const BooksView = observer(({ controller }) => (
  <div>
    {controller.books.map(book => <BookItem book={book} />)}
    <AddBookForm controller={controller} />
  </div>
));
```

## Development Guidelines

1. **Never put logic in JSX/TSX files**
2. **Use controllers for presentation logic**
3. **Use stores for business logic**
4. **Keep views as pure as possible**
5. **Test all business logic thoroughly**

## Troubleshooting

### SSL Certificate Issues
If you encounter SSL certificate errors:
1. Open `https://tdd.demo.reaktivate.com/v1/books/postnikov` in your browser
2. Accept the self-signed certificate
3. Try the application again

### Test Failures
- Ensure all dependencies are installed: `npm install`
- Clear Jest cache: `npm test -- --clearCache`
- Check that all mocks are properly configured

## Contributing

When contributing to this project:
1. Follow the fast-test architecture principles
2. Write tests for all new business logic
3. Keep UI components pure and simple
4. Use MobX for state management
5. Maintain separation between logic and presentation
