import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { observer } from "mobx-react";

import "./styles.css";
import UIStore from "./Shared/UI.store";
import BooksStore from "./Books/Books.store";
import BooksController from "./Books/Books.controller";
import BooksView from "./Books/Books.view";
import HeaderView from "./Shared/Header.view";

// Create store and controller instances
const uiStore = new UIStore();
const booksStore = new BooksStore(uiStore);
const booksController = new BooksController(booksStore);

const App = observer(() => {
  useEffect(() => {
    booksController.store.loadBooks();
  }, []);

  return (
    <div className="App">
      <HeaderView privateBooksCount={booksController.privateBooksCount} />
      <main className="main-content">
        <BooksView controller={booksController} />
      </main>
    </div>
  );
});

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
