import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { CustomErrorStateMatcher } from './custom-error-state-matcher';

describe('CustomErrorStateMatcher', () => {
    let customErrorStateMatcher: CustomErrorStateMatcher;

    beforeEach(() => {
        customErrorStateMatcher = new CustomErrorStateMatcher();
    });

    it('should return false if form is untouched after being submitted', () => {
        const control = new FormControl();
        const form = {
            submitted: true
        } as FormGroupDirective | NgForm;

        expect(customErrorStateMatcher.isErrorState(control, form)).toBe(false);
    });

    it('should return true if form is dirty and invalid after being submitted', () => {
        const control = new FormControl('', [Validators.required]);
        const form = {
            submitted: false
        } as FormGroupDirective | NgForm;
        control.markAsDirty();
        expect(customErrorStateMatcher.isErrorState(control, form)).toBe(true);
    });

});