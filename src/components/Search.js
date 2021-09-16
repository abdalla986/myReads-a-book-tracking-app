import React from "react";
import Book from "./Book";
import React, { useState } from 'react'


class Search extends React.Component {
  render() {

    const setShowSearchPage = useState(false);
    const [query, setQuery] = useState('');
    const combinedBooks = useState([]);

    const updateBookShelf = (book, whereTo) => {
      const updatedBooks = books.map((b) => {
        if (b.id === book.id) {
          book.shelf = whereTo;
          return book;
        }
        return b;
      })
      setBooks(updatedBooks);
      BooksAPI.update(book, whereTo);
    }

    const [books, setBooks] = useState([]);

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <button className="close-search" onClick={() => setShowSearchPage(false)}>Close</button>
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
}

export default Search;
