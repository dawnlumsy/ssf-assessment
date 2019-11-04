import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './components/search.component';
import { BookListComponent } from './components/book-list.component';
import { DisplayComponent } from './components/display.component';

const ROUTES: Routes = [
  { path: '', component: SearchComponent },
  { path: 'books', component: BookListComponent },
  { path: 'book/:bookid', component: DisplayComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(ROUTES) ],
  exports: [ RouterModule ]
})
export class AppRouteModule { }
