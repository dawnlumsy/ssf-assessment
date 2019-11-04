import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../book.service';
import { BookResponse } from '../models';


@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  
  bookResponse: BookResponse;

  constructor(private activedRoute: ActivatedRoute, private bookSvc: BookService, private router: Router) { }

  ngOnInit() {
    const book_id = this.activedRoute.snapshot.params.bookid;
    this.bookSvc.getBook(book_id)
      .then(result => {
          this.bookResponse = result;
          console.info(result);      
        }
      )
      .catch(error => {error})
  }

  navigateToHome(){
    this.router.navigate(['/']);
  }
}
