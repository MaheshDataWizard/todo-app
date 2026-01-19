import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo-service';
import { Todo } from '../../models/todo-model';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-create-todo',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './create-todo.html',
  styleUrl: './create-todo.css',
})
export class CreateTodo implements OnInit {
  todoId?: string;

  title = '';
  description = '';
  isCompleted = false;

  isEditMode = false;
  isSubmitting = false;
  isLoading = false;

  constructor(
    private todoService: TodoService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) { }

  async ngOnInit() {
    this.todoId = this.route.snapshot.paramMap.get('id') || undefined;

    if (this.todoId) {
      this.isEditMode = true;
      this.isLoading = true;
      const todo = await this.todoService.getTodoById(this.todoId);
      if (todo) {
        this.title = todo.title;
        this.description = todo.description;
        this.isCompleted = todo.isCompleted;
      }
      this.isLoading = false;
    }
  }


  async submitTodo() {
    if (!this.validateForm()) return;

    this.isSubmitting = true;

    const todo: Todo = {
      title: this.title.trim(),
      description: this.description.trim(),
      isCompleted: this.isCompleted,
    };

    try {
      if (this.isEditMode && this.todoId) {
        await this.todoService.updateTodo(this.todoId, todo);
        this.toast.showMessage('Todo updated successfully ✅', 'success');
      } else {
        await this.todoService.addTodo(todo);
        this.toast.showMessage('Todo added successfully 🎉', 'success');
      }

      this.router.navigate(['/todo']);
    } catch (error) {
      console.error(error);
      this.toast.showMessage('Something went wrong ❌', 'error');
    } finally {
      this.isSubmitting = false;
    }
  }

  private validateForm(): boolean {
    if (!this.title.trim()) {
      this.toast.showMessage('Title is required ❗', 'error');
      return false;
    }

    if (!this.description.trim()) {
      this.toast.showMessage('Description is required ❗', 'error');
      return false;
    }

    return true;
  }

  cancel() {
    this.router.navigate(['/todo']);
  }
}
