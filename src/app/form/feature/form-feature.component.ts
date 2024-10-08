import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormService } from './../data-access/form-service.service';
import { FormStateService } from './../data-access/form-state-service.service';
import { FormHistoryState } from './../data-access/form-state.model';
import { FormComponent } from '../ui/form/form.component';

@Component({
  selector: 'app-form-feature',
  standalone: true,
  imports: [CommonModule, RouterLink, FormComponent],
  templateUrl: './form-feature.component.html',
  styleUrl: './form-feature.component.scss',
})
export class FormFeatureComponent implements OnInit, OnDestroy {
  dynamicForm: FormGroup;
  showUndo: boolean = false;
  showRedo: boolean = false;

  private formStateSubscription!: Subscription;

  constructor(
    private formService: FormService,
    private formStateService: FormStateService
  ) {
    this.dynamicForm = this.formService.createForm();
  }

  ngOnInit(): void {
    this.subscribeToFormState();
  }

  ngOnDestroy(): void {
    this.formStateSubscription?.unsubscribe();
  }

  private subscribeToFormState(): void {
    this.formStateSubscription = this.formStateService.formState$.subscribe(
      (state: FormHistoryState) => {
        this.formService.updateFormFromState(this.dynamicForm, state);
        this.updateUndoRedoVisibility(state);
      }
    );
  }

  private updateUndoRedoVisibility(state: any): void {
    this.showUndo = state.past && state.past.length > 0;
    this.showRedo = state.future && state.future.length > 0;
  }

  undoFormState(): void {
    this.formStateService.undo();
  }

  redoFormState(): void {
    this.formStateService.redo();
  }

  get interests() {
    return this.dynamicForm.get('interests') as FormArray;
  }

  addInterest(): void {
    this.formService.addInterest(this.interests);
  }

  removeInterest(index: number): void {
    this.formService.removeInterest(this.interests, index);
    this.saveFormData();
  }

  onSubmit(): void {
    if (this.dynamicForm.valid) {
      this.formService.handleSubmit();
      this.formService.resetForm(this.dynamicForm);
      this.formStateService.reset();
    }
  }

  resetForm(): void {
    this.formService.resetForm(this.dynamicForm);
    this.saveFormData();
  }

  onBlur(controlName: string): void {
    if (this.formService.hasControlChanged(this.dynamicForm, controlName)) {
      this.saveFormData();
    }
  }

  saveFormData(): void {
    const formData = this.formService.getFormData(this.dynamicForm);
    this.formStateService.updateFormState(formData);
  }
}
