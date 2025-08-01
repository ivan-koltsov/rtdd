import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { observer } from "mobx-react";

import "./styles.css";
import BooksStore from "./Books/Books.store";
import BooksController from "./Books/Books.controller";
import BooksView from "./Books/Books.view";

// Create store and controller instances
const booksStore = new BooksStore();
const booksController = new BooksController(booksStore);

const App = observer(() => {
  useEffect(() => {
    booksController.store.loadBooks();
  }, []);

  return (
    <div className="App">
      <BooksView controller={booksController} />
    </div>
  );
});

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
