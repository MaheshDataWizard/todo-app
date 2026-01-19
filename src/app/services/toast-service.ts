export type ToastType = 'success' | 'error' | 'info';
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
export interface ToastAction {
    label: string;
    action: () => void;
}

export interface Toast {
    message: string;
    type: ToastType;
    actions?: ToastAction[];
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    private toastSubject = new BehaviorSubject<Toast | null>(null);
    toast$ = this.toastSubject.asObservable();

    // Confirmation / custom toast (NO auto-close)
    show(toast: Toast) {
        this.toastSubject.next(toast);
    }

    // Simple toast (auto-close)
    showMessage(message: string, type: ToastType, duration = 3000) {
        this.toastSubject.next({ message, type });

        setTimeout(() => {
            this.clear();
        }, duration);
    }

    clear() {
        this.toastSubject.next(null);
    }
}
