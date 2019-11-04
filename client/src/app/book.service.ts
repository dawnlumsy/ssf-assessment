import { Injectable } from "@angular/core";
import { SearchCriteria, BooksResponse, BookResponse, Book } from './models';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class BookService {
  constructor(private http: HttpClient) { }

  api_url = `http://localhost:3000/api/search`;
  api_url_book = `http://localhost:3000/api/book/`

  getBooks(searchCriteria: SearchCriteria): Promise<BooksResponse> {
    //TODO - for Task 3 and Task 4
    console.info("enter getBooks");
    const params = new HttpParams()
        .set('terms', searchCriteria.terms)
        .set('limit', searchCriteria.limit + '');
    return (
      this.http.get<BooksResponse>(this.api_url, {params}).toPromise()
    )
  }


  getBook(bookId: string): Promise<BookResponse> {
    //TODO - for Task 5
    console.info("enter >> getBook");
    console.info(this.api_url_book+bookId);
    return (
      this.http.get<BookResponse>(this.api_url_book+bookId).toPromise()
    );
  }
}
