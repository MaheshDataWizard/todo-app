import { Routes } from '@angular/router';
import { CreateTodo } from './todo/create-todo/create-todo';
import { ListTodo } from './todo/list-todo/list-todo';

export const routes: Routes = [
    { path: '', redirectTo: 'todo', pathMatch: 'full' },

    { path: 'todo', component: ListTodo },          // ✅ REQUIRED
    { path: 'todo/create', component: CreateTodo },
    { path: 'todo/edit/:id', component: CreateTodo },

    { path: '**', redirectTo: 'todo' }
];
