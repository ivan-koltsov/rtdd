import React from "react";
import { observer } from "mobx-react";

const BooksFilterView = observer(({ controller }) => {
  return (
    <div className="books-filter">
      <div className="filter-tabs">
        <button
          className={`filter-tab ${controller.isAllBooksSelected ? 'active' : ''}`}
          onClick={controller.switchToAllBooks}
          disabled={controller.isLoading}
        >
          All books
        </button>
        <button
          className={`filter-tab ${controller.isPrivateBooksSelected ? 'active' : ''}`}
          onClick={controller.switchToPrivateBooks}
          disabled={controller.isLoading}
        >
          Private books
        </button>
      </div>
    </div>
  );
});

export default BooksFilterView; 