import { Component, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { map } from 'rxjs/operators';

const validateForm: ValidatorFn = (form: FormGroup) => {
  const invalidKey = Object.keys(form.controls).find(
    (key) => form.controls[key].status !== 'VALID'
  );

  if (!invalidKey) return null;

  return {
    invalidField: invalidKey,
  };
};

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  form = new FormGroup(
    {
      enabled: new FormControl(false),

      value: new FormControl(
        { value: '', disabled: true },
        {
          validators: Validators.required,
        }
      ),

      selectionA: new FormControl('', Validators.required),
      selectionB: new FormControl('', Validators.required),
      selectionC: new FormControl('', Validators.required),
    },
    {
      validators: validateForm,
    }
  );

  selectionBOptions$ = this.form.get('selectionA').valueChanges.pipe(
    map((selection) => {
      if (selection === 'a') {
        return [
          { name: 'A - A', value: 'a' },
          { name: 'A - B', value: 'b' },
        ];
      }

      if (selection === 'b') {
        return [
          { name: 'B - A', value: 'a' },
          { name: 'B - B', value: 'b' },
        ];
      }

      return [];
    })
  );

  selectionCOptions$ = this.form.get('selectionB').valueChanges.pipe(
    map((selectionB) => {
      const selectionA = this.form.get('selectionA').value;

      if (selectionA === 'a' && selectionB === 'a') {
        return [
          { name: 'A - A - A', value: 'a' },
          { name: 'A - A - B', value: 'b' },
        ];
      }

      if (selectionA === 'a' && selectionB === 'b') {
        return [
          { name: 'A - B - A', value: 'a' },
          { name: 'A - B - B', value: 'b' },
        ];
      }

      if (selectionA === 'b' && selectionB === 'b') {
        return [
          { name: 'B - B - A', value: 'a' },
          { name: 'B - B - B', value: 'b' },
        ];
      }

      if (selectionA === 'b' && selectionB === 'a') {
        return [
          { name: 'B - A - A', value: 'a' },
          { name: 'B - A - B', value: 'b' },
        ];
      }

      return [];
    })
  );

  ngOnInit() {
    // any time this input toggles, enable/disable
    this.form.get('enabled').valueChanges.subscribe((enabled) => {
      if (enabled) {
        this.form.get('value').enable();
      } else {
        this.form.get('value').disable();
      }
    });

    this.form
      .get('selectionA')
      .valueChanges.subscribe(() => this.form.get('selectionB').reset());

    this.form
      .get('selectionB')
      .valueChanges.subscribe(() => this.form.get('selectionC').reset());
  }

  onSubmit() {
    console.log(this.form.valid, this.form.errors);
    if (this.form.valid) {
      this.form.reset();
    }
  }
}
