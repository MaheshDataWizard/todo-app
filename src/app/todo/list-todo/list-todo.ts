import { Component } from '@angular/core';
import { TodoService } from '../../services/todo-service';
import { Todo } from '../../models/todo-model';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-list-todo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list-todo.html',
  styleUrl: './list-todo.css',
})
export class ListTodo {

  todos: Todo[] = [];

  constructor(
    private todoService: TodoService,
    private toast: ToastService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.todos = await this.todoService.getTodos();
    console.log('todos', this.todos);
  }

  async deleteTodo(todoId: string) {
    const confirmDelete = confirm('Are you sure you want to delete this todo?');

    if (confirmDelete) {
      await this.todoService.deleteTodo(todoId);
      this.toast.show('Todo deleted ❌');
      await this.ngOnInit();
    }
  }


  navigateToAdd() {
    this.router.navigate(['/todo/create']);
  }

  async updateTodo(todoId: string, todo: Todo) {
    if (todo.isCompleted) {
      const confirmUpdate = confirm('Are you sure you want to update this todo?');
      if (confirmUpdate) {
        await this.todoService.updateTodo(todoId, todo);
        this.toast.show('Todo updated successfully ✅');
        this.ngOnInit();
      }
    }
  }
}
