import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
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
import { Observable, take } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-feature',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './form-feature.component.html',
  styleUrl: './form-feature.component.scss',
})
export class FormFeatureComponent implements OnInit, OnDestroy {
  dynamicForm: FormGroup;
  formState$: Observable<FormHistoryState>;
  showUndo: boolean = false;
  showRedo: boolean = true;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ form: FormHistoryState }>
  ) {
    this.dynamicForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      interests: this.fb.array([]),
    });

    this.formState$ = this.store.select('form');
  }

  ngOnInit(): void {
    this.initializeForm();
    this.subscribeToFormState();
  }

  private initializeForm(): void {
    this.formState$.pipe(take(1)).subscribe((state: FormHistoryState) => {
      if (state.present) {
        this.dynamicForm.patchValue({
          name: state.present.name,
          email: state.present.email,
          interests: state.present.interests || [],
        });
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

  ngOnDestroy(): void {
    this.submitFormData();
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
  }

  onSubmit() {
    if (this.dynamicForm.valid) {
      this.submitFormData();
    }
  }

  submitFormData() {
    const { name, email, interests } = this.dynamicForm.value;
    this.store.dispatch(updateFormState({ name, email, interests }));
  }
}
