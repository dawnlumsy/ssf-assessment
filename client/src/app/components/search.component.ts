import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchCriteria } from '../models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {


  constructor(private router: Router) { }

  ngOnInit() { }

  search(form: NgForm) {
    console.info("form values", form.value);
    this.router.navigate([ '/books' ], { state: form.value as SearchCriteria });
    form.resetForm();
  }

}
