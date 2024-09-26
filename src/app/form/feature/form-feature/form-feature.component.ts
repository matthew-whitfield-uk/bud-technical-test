import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { FormHistoryState } from '../../data-access/form-state.model';
import {
  redoFormState,
  undoFormState,
  updateFormState,
} from '../../data-access/form.actions';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-feature',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './form-feature.component.html',
  styleUrl: './form-feature.component.scss',
})
export class FormFeatureComponent implements OnInit {
  dynamicForm: FormGroup;
  formState$: Observable<FormHistoryState>;
  showUndo: boolean = false;
  showRedo: boolean = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ form: FormHistoryState }>
  ) {
    this.dynamicForm = this.fb.group({
      name: new FormControl<string>('', Validators.required),
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
      interests: this.fb.array([]),
    });

    this.formState$ = this.store.select('form');
  }

  ngOnInit(): void {
    this.initializeForm();
    this.subscribeToFormState();
  }

  private initializeForm(): void {
    this.formState$.subscribe((state: FormHistoryState) => {
      if (state.present) {
        this.dynamicForm.patchValue({
          name: state.present.name,
          email: state.present.email,
        });

        const interestsFormArray = this.dynamicForm.get(
          'interests'
        ) as FormArray;
        interestsFormArray.clear(); // Clear existing controls


        if (state.present.interests && state.present.interests.length > 0) {

          state.present.interests.forEach((interest: string) => {
            interestsFormArray.push(new FormControl(interest));
          });
        }
      }
      this.updateUndoRedoVisibility(state);
    });
  }

  private subscribeToFormState(): void {
    this.formState$.subscribe(this.updateUndoRedoVisibility.bind(this));
  }

  private updateUndoRedoVisibility(state: FormHistoryState): void {
    this.showUndo = state.past && state.past.length > 0;
    this.showRedo = state.future && state.future.length > 0;
  }



  undoFormState() {
    this.store.dispatch(undoFormState());
  }

  redoFormState() {
    this.store.dispatch(redoFormState());
  }

  get name() {
    return this.dynamicForm.get('name');
  }
  get email() {
    return this.dynamicForm.get('email');
  }
  get interests() {
    return this.dynamicForm.get('interests') as FormArray;
  }

  addInterest() {
    this.interests.push(this.fb.control(''));
  }

  removeInterest(index: number) {
    this.interests.removeAt(index);
    this.saveFormData();
  }

  onSubmit() {
    if (this.dynamicForm.valid) {
      this.saveFormData();
      alert('form submitted');
      this.resetForm()
      this.saveFormData();
    }
  }

  resetForm() {
    this.dynamicForm.reset();
    const interestsFormArray = this.dynamicForm.get(
      'interests'
    ) as FormArray;
    interestsFormArray.clear(); // Clear existing controls
  }

  onBlur(controlName: string): void {
    const control = this.dynamicForm.get(controlName);



    if (control) {
      if (control instanceof FormArray) {
        // Compare FormArray values using JSON.stringify
        if (JSON.stringify(this.lastSavedValues[controlName]) !== JSON.stringify(control.value)) {
          console.log('save form interest');
          this.saveFormData()
        }
      } else {
        // Direct comparison for other controls
        if (this.lastSavedValues[controlName] !== control.value) {
          console.log('save form normal');
          this.saveFormData()
        }
      }
    }
  }

  lastSavedValues: any = {};

  saveFormData() {
    const { name, email, interests } = this.dynamicForm.value;
    console.log('store dispatch', name, email, interests);
    this.lastSavedValues = { name, email, interests };
    this.store.dispatch(updateFormState({ name, email, interests }));
  }
}
