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
      const todo = await this.todoService.getTodoById(this.todoId);
      if (todo) {
        this.title = todo.title;
        this.description = todo.description;
        this.isCompleted = todo.isCompleted;
      }
    }
  }

  /** ✅ FORM SUBMIT */
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
        this.toast.show('Todo updated successfully ✅');
      } else {
        await this.todoService.addTodo(todo);
        this.toast.show('Todo added successfully 🎉');
      }

      this.router.navigate(['/todo']);
    } catch (error) {
      console.error(error);
      this.toast.show('Something went wrong ❌');
    } finally {
      this.isSubmitting = false;
    }
  }

  /** 🔍 VALIDATION */
  private validateForm(): boolean {
    if (!this.title.trim()) {
      this.toast.show('Title is required ❗');
      return false;
    }

    if (!this.description.trim()) {
      this.toast.show('Description is required ❗');
      return false;
    }

    return true;
  }

  cancel() {
    this.router.navigate(['/todo']);
  }
}
