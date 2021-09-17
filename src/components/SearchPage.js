import React, { useState } from "react";
import { Link } from "react-router-dom";
import Book from "./Book";
import * as BooksAPI from '../BooksAPI'

const SearchPage = () => {

  const [query, setQuery] = useState('');

  const [combinedBooks] = useState([])

  const [booksMap] = useState(new Map())

  const updateBookShelf = (book, whereTo) => {
    const updatedBooks = books.map(b => {
      if (b.id === book.id) {
        book.shelf = whereTo;
        return book;
      }
      return b;
    })
    // if the book is not on any shelf previously, the book has to be added to the updatedBooks array.
    if (!booksMap.has(book.id)) {
      book.shelf = whereTo;
      updatedBooks.push(book)
    }
    setBooks(updatedBooks);
    BooksAPI.update(book, whereTo);
  }

  const [books, setBooks] = useState([]);

  return (
    <div className="search-books">
      <div className="search-books-bar">
        {/* The search page contains a link to the main page. */}
        <button><Link className="close-search" to='/' /></button>
        <div className="search-books-input-wrapper">
          <input 
            type="text" 
            placeholder="Search by title or author" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}/>
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {combinedBooks.map(b => (
            <li key={b.id}>
              <Book book={b} changeBookShelf={updateBookShelf}/>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default SearchPage;
