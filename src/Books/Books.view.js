import React from "react";
import { observer } from "mobx-react";

const BooksView = observer(({ controller }) => {
  return (
    <div className="books-container">
      <h1>Books ({controller.booksCount})</h1>
      
      {controller.error && (
        <div className="error-message">
          Error: {controller.error}
        </div>
      )}
      
      {controller.isLoading && (
        <div className="loading">Loading...</div>
      )}
      
      <div className="books-list">
        {controller.books.map((book, index) => (
          <BookItem key={index} book={book} />
        ))}
      </div>
      
      <AddBookForm controller={controller} />
    </div>
  );
});

const BookItem = ({ book }) => (
  <div className="book-item">
    <strong>{book.author}</strong>: {book.name}
  </div>
);

const AddBookForm = observer(({ controller }) => (
  <div className="add-book-form">
    <h2>Add New Book</h2>
    <div className="form-group">
      <input
        type="text"
        placeholder="Book name"
        value={controller.newBookName}
        onChange={(e) => controller.setNewBookName(e.target.value)}
        disabled={controller.isLoading}
      />
    </div>
    <div className="form-group">
      <input
        type="text"
        placeholder="Author name"
        value={controller.newBookAuthor}
        onChange={(e) => controller.setNewBookAuthor(e.target.value)}
        disabled={controller.isLoading}
      />
    </div>
    <button
      onClick={controller.handleAddBook}
      disabled={!controller.isFormValid || controller.isLoading}
    >
      {controller.isLoading ? "Adding..." : "Add Book"}
    </button>
  </div>
));

export default BooksView; 