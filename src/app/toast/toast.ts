import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast-service';
import { Observable } from 'rxjs';
import { Toast } from '../services/toast-service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastComponent {

  toast$!: Observable<Toast | null>;

  constructor(private toastService: ToastService) {
    this.toast$ = this.toastService.toast$;
  }
}
