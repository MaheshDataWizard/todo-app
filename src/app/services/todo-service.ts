import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { Todo } from '../models/todo-model';

@Injectable({ providedIn: 'root' })
export class TodoService {

    constructor(private firestore: Firestore) { }

    addTodo(todo: Todo) {
        const todoRef = collection(this.firestore, 'todos');
        return addDoc(todoRef, {
            title: todo.title,
            description: todo.description,
            isCompleted: todo.isCompleted,
            createdAt: Date.now()
        });
    }

    async getTodos(): Promise<Todo[]> {
        const todoRef = collection(this.firestore, 'todos');
        const snapshot = await getDocs(todoRef);

        return snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Todo, 'id'>)
        }));
    }

    async getTodoById(id: string): Promise<Todo | null> {
        const docRef = doc(this.firestore, 'todos', id);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) return null;

        return {
            id: snapshot.id,
            ...(snapshot.data() as Omit<Todo, 'id'>)
        };
    }

    updateTodo(todoId: string, todo: Todo) {
        const docRef = doc(this.firestore, 'todos', todoId);
        return updateDoc(docRef, {
            title: todo.title,
            description: todo.description,
            isCompleted: todo.isCompleted
        });
    }

    deleteTodo(todoId: string) {
        const docRef = doc(this.firestore, 'todos', todoId);
        return deleteDoc(docRef);
    }
}
