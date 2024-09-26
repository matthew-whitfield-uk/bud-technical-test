import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  @Input() dynamicForm!: FormGroup;

  @Output() addInterest = new EventEmitter<void>();
  @Output() removeInterest = new EventEmitter<number>();
  @Output() submitForm = new EventEmitter<void>();
  @Output() blurField = new EventEmitter<string>();

  get name() {
    return this.dynamicForm.get('name');
  }

  get email() {
    return this.dynamicForm.get('email');
  }

  get interests() {
    return this.dynamicForm.get('interests') as FormArray;
  }

  onBlur(controlName: string): void {
    this.blurField.emit(controlName);
  }

  onRemoveInterest(index: number): void {
    this.removeInterest.emit(index);
  }

  onAddInterest(): void {
    this.addInterest.emit();
  }

  onSubmit(): void {
    this.submitForm.emit();
  }

}
