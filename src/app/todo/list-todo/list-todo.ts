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
        this.toast.showMessage('Realtime update failed ❌', 'error');
        this.isLoading = false;
      }
    );
  }

  confirmMarkComplete(todo: Todo) {
    if (!todo.id || todo.isCompleted) return;

    this.toast.show({
      message: 'Mark this task as Completed?',
      type: 'info',
      actions: [
        {
          label: 'Yes',
          action: async () => {
            // 1️⃣ Hide confirmation toast
            this.toast.clear();

            try {
              // 2️⃣ Perform action
              await this.todoService.updateTodo(todo.id!, {
                ...todo,
                isCompleted: true,
              });

              // 3️⃣ Show success toast (auto-close)
              this.toast.showMessage('Task marked as Completed ✅', 'success');
            } catch {
              this.toast.showMessage('Failed to update task ❌', 'error');
            }
          }
        },
        {
          label: 'No',
          action: () => {
            // Hide confirmation toast only
            this.toast.clear();
          }
        }
      ]
    });
  }

  private async markAsCompleted(todo: Todo) {
    try {
      await this.todoService.updateTodo(todo.id!, {
        ...todo,
        isCompleted: true,
      });

      this.toast.showMessage('Task marked as Completed ✅', 'success');
    } catch (error) {
      console.error(error);
      this.toast.showMessage('Failed to update task ❌', 'error');
    }
  }
  deleteTodo(todoId: string) {
    const todo = this.todos.find(t => t.id === todoId);
    if (!todo) return;

    if (!todo.isCompleted) {
      this.toast.showMessage('Complete task before deleting ❌', 'error');
      return;
    }

    this.toast.show({
      message: 'Delete this completed todo?',
      type: 'info',
      actions: [
        {
          label: 'Yes',
          action: async () => {
            this.toast.clear();
            try {
              await this.todoService.deleteTodo(todoId);
              this.toast.showMessage('Todo deleted ❌', 'success');
            } catch {
              this.toast.showMessage('Delete failed ❌', 'error');
            }
          }
        },
        {
          label: 'No',
          action: () => this.toast.clear()
        }
      ]
    });
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
