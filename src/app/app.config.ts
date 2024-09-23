import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { StoreModule } from '@ngrx/store';
import { formReducer } from './form/data-access/form.reducer';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(StoreModule.forRoot({ form: formReducer }))]
};
