import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    message: string;
    type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {

    private toastSubject = new BehaviorSubject<Toast | null>(null);
    toast$ = this.toastSubject.asObservable();

    show(message: string, type: ToastType = 'info', duration = 3000) {
        this.toastSubject.next({ message, type });

        setTimeout(() => {
            this.clear();
        }, duration);
    }

    clear() {
        this.toastSubject.next(null);
    }
}
