import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTodo } from './list-todo';

describe('ListTodo', () => {
  let component: ListTodo;
  let fixture: ComponentFixture<ListTodo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTodo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTodo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
