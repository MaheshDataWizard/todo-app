import { Routes } from '@angular/router';
import { CreateTodo } from './todo/create-todo/create-todo';
export const routes: Routes = [
    { path: '', component: CreateTodo },
    { path: '**', redirectTo: '' }
];
