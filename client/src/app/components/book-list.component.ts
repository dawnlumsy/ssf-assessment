import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { SearchCriteria, ErrorResponse, BooksResponse } from '../models';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  limit = 10;
  offset = 0;
  terms = '';
  newoffset = 0;

  books: BooksResponse = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute
      , private bookSvc: BookService) { }

  ngOnInit() {
    console.info('Enter book list component');
    const state = window.history.state;
    if (!state['terms'])
      return this.router.navigate(['/']);

    this.terms = state.terms;
    this.limit = state.limit || 10;

    const searchCriterial: SearchCriteria = {
      terms: this.terms,
      limit: this.limit
    }
    this.bookSvc.getBooks(searchCriterial)
      .then(result => {
        this.books = result;
        console.info('>getBoooks > result:', result);
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      })
  }

  next() {
    //TODO - for Task 4

    this.newoffset = this.books.offset + this.books.limit;
    console.log("this.newoffset: ", this.newoffset);
    console.log("this.books.limit: ", this.books.limit);

    const searchCriterialwOffset: SearchCriteria = {
      terms: this.terms,
      limit: this.limit,
      offset: this.newoffset
    }
    this.bookSvc.getBooks(searchCriterialwOffset)
    .then(result => {
      this.books = result;
      console.info('>getBoooks > result:', result);
    }).catch(error => {
      const errorResponse = error as ErrorResponse;
      alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
    })
  }

  calculate (totalcount, perpage) {
    let Quotient = (this.books.total - (this.books.total % this.books.limit)) / this.books.limit
    console.log(">>", this.books.total % this.books.limit);
    console.log("")
    if ((this.books.total % this.books.limit) == 0) {
      console.log("Enter If");
      return Quotient;
    }
    else {
      console.log("Enter Else", Quotient++);
      return Quotient++;
    }
  }

  previous() {
    //TODO - for Task 4
  }

  bookDetails(book_id: string) {
    //TODO
    this.router.navigate(['book', book_id]);
  }

  back() {
    this.router.navigate(['/']);
  }

}
