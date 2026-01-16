import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTodo } from './create-todo';

describe('CreateTodo', () => {
  let component: CreateTodo;
  let fixture: ComponentFixture<CreateTodo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTodo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTodo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
