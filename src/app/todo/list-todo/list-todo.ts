import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import {
  Firestore,
  collection,
  onSnapshot,
  query,
  orderBy,
} from '@angular/fire/firestore';

import { TodoService } from '../../services/todo-service';
import { ToastService } from '../../services/toast-service';
import { Todo } from '../../models/todo-model';

@Component({
  selector: 'app-list-todo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list-todo.html',
  styleUrl: './list-todo.css',
})
export class ListTodo implements OnInit, OnDestroy {
  todos: Todo[] = [];
  isLoading = false;

  private unsubscribe!: () => void;

  constructor(
    private firestore: Firestore,
    private todoService: TodoService,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.listenToTodos();
  }

  private listenToTodos() {
    this.isLoading = true;

    const todoRef = collection(this.firestore, 'todos');
    const todoQuery = query(todoRef, orderBy('createdAt', 'desc'));

    this.unsubscribe = onSnapshot(
      todoQuery,
      (snapshot) => {
        this.todos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Todo, 'id'>),
        }));
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        this.toast.show('Realtime update failed ❌');
        this.isLoading = false;
      }
    );
  }

  confirmMarkComplete(todo: Todo) {
    if (!todo.id || todo.isCompleted) return;

    const message = 'Mark this task as Completed?';
    this.toast.show(message);

    const confirmed = confirm(message);
    if (!confirmed) return;

    this.markAsCompleted(todo);
  }

  private async markAsCompleted(todo: Todo) {
    try {
      await this.todoService.updateTodo(todo.id!, {
        ...todo,
        isCompleted: true,
      });

      this.toast.show('Task marked as Completed ✅');
    } catch (error) {
      console.error(error);
      this.toast.show('Failed to update task ❌');
    }
  }

  async deleteTodo(todoId: string) {
    const todo = this.todos.find((t) => t.id === todoId);
    if (!todo) return;
    if (!todo.isCompleted) {
      this.toast.show('Cannot delete a pending task ❌ Complete it first!');
      return;
    }

    const confirmed = confirm('Are you sure you want to delete this completed todo?');
    if (!confirmed) return;

    try {
      await this.todoService.deleteTodo(todoId);
      this.toast.show('Todo deleted ❌');
    } catch (error) {
      console.error(error);
      this.toast.show('Delete failed ❌');
    }
  }

  navigateToAdd() {
    this.router.navigate(['/todo/create']);
  }
  trackById(index: number, todo: Todo) {
    return todo.id;
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
