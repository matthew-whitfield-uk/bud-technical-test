export interface FormState {
  name: string;
  email: string;
  interests: string[];
}

export interface FormHistoryState {
  past: FormState[];
  present: FormState;
  future: FormState[];
}
