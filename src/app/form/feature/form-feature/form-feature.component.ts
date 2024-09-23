import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-feature',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-feature.component.html',
  styleUrl: './form-feature.component.scss'
})
export class FormFeatureComponent {
  dynamicForm: FormGroup;


  constructor(private fb: FormBuilder){
    this.dynamicForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      interests: this.fb.array([])
    });
  }

  get name() { return this.dynamicForm.get('name'); }
  get email() { return this.dynamicForm.get('email'); }
  get interests() { return this.dynamicForm.get('interests') as FormArray; }

  addInterest() {
    this.interests.push(this.fb.control(''));
  }

  removeInterest(index: number) {
    this.interests.removeAt(index);
  }

  onSubmit() {
    if (this.dynamicForm.valid) {
      console.log(this.dynamicForm.value);
      // Here you would typically send the form data to a server
    }
  }
}
