import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import { Firestore, collection, onSnapshot, query, orderBy } from '@angular/fire/firestore';

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

  /** 🔥 REALTIME LISTENER */
  private listenToTodos() {
    this.isLoading = true;

    const todoRef = collection(this.firestore, 'todos');
    const todoQuery = query(todoRef, orderBy('createdAt', 'desc'));

    this.unsubscribe = onSnapshot(
      todoQuery,
      (snapshot) => {
        this.todos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Todo, 'id'>)
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

  /** 🔹 Delete todo */
  async deleteTodo(todoId: string) {
    const confirmDelete = confirm('Are you sure you want to delete this todo?');
    if (!confirmDelete) return;

    try {
      await this.todoService.deleteTodo(todoId);
      this.toast.show('Todo deleted ❌');
      // 🔥 NO manual UI update needed
    } catch (error) {
      this.toast.show('Delete failed ❌');
      console.error(error);
    }
  }

  /** 🔹 Toggle completion */
  async toggleTodo(todo: Todo) {
    if (!todo.id) return;

    const confirmUpdate = confirm('Are you sure you want to update this todo?');
    if (!confirmUpdate) return;

    try {
      await this.todoService.updateTodo(todo.id, {
        ...todo,
        isCompleted: !todo.isCompleted
      });

      this.toast.show('Todo updated successfully ✅');
      // 🔥 UI auto-updates via snapshot
    } catch (error) {
      this.toast.show('Update failed ❌');
      console.error(error);
    }
  }

  /** 🔹 Navigate to create */
  navigateToAdd() {
    this.router.navigate(['/todo/create']);
  }

  /** 🔹 Performance optimization */
  trackById(index: number, todo: Todo): string | undefined {
    return todo.id;
  }

  /** 🔥 CLEANUP */
  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
