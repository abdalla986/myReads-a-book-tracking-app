// Reference for useState here https://reactjs.org/docs/hooks-overview.html
// Reference for useEffect here https://reactjs.org/docs/hooks-overview.html#effect-hook
import React, {useState, useEffect} from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Header from './components/Header'
import Shelves from './components/Shelves'
import Book from './components/Book'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import ScrollUpButton from "react-scroll-up-button";

const BooksApp = () => {

  const [query, setQuery] = useState('');

  const [findBook, setFindBook] = useState([])

  const [combinedBooks, setCombinedBooks] = useState([])

  const [booksMap, setBooksMap] = useState(new Map())

  useEffect(() => {

    BooksAPI.getAll()
      .then(data => 
        {
          setBooks(data)
          setBooksMap(setTheMap(data))
        }
      );
  }, [])


  useEffect(() => {
    let isFocused = true;
    if (query) {
      BooksAPI.search(query).then(data => {
        if (data.error) {
          setFindBook([])
        } else {
          if (isFocused) {
            setFindBook(data)
          }
        }
      })
    }

    return () => {
      isFocused = false;
      setFindBook([]);
    }
    
  }, [query])


  useEffect(() => {
    const merged = findBook.map(book => {
      if (booksMap.has(book.id)) {
        return booksMap.get(book.id)
      } else {
        return book;
      }
    })

    setCombinedBooks(merged);
  }, [findBook])

  const setTheMap = (books => {
    const map = new Map()
    books.map(book => {
      map.set(book.id, book)
    })
    return map;
  })

  

   const [books, setBooks] = useState([]);

   //  The function that allows users to move books between shelves.   
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

  return (
    <div className="app">
      <Router>
        <Switch>
          {/* Search Page */}
          <Route path='/search'>
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
          </Route>

          {/* Main Page */}
          <Route path='/'>
            <div className="list-books">
              <Header />
              <div className="list-books-content">
                <Shelves books={books} updateBookShelf={updateBookShelf}/>
              </div>
              <div className="open-search">
                {/* The main page contains a link to the search page. */}
                <Link to='/search' ><button>Add a book</button></Link>
              </div>
            </div>
          </Route>
        </Switch>
      </Router>

      <ScrollUpButton style={{bottom: 80, width: 40, right: 80}} ToggledStyle={{right: 30}}/>
    </div>
  ) 
}

export default BooksApp;
