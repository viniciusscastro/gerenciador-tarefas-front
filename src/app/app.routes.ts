import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tarefas', pathMatch: 'full' },
  { path: 'tarefas', component: AppComponent }
];