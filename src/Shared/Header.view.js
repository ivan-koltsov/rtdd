import React from "react";
import { observer } from "mobx-react";

const HeaderView = observer(({ privateBooksCount }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">Books Library</h1>
        <div className="private-books-counter">
          Your books: {privateBooksCount}
        </div>
      </div>
    </header>
  );
});

export default HeaderView; 