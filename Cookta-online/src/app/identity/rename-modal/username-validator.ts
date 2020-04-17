import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';

export function UsernameValidator(getNameExist: (string) => Promise<boolean>): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors> | null => {
    return new Promise(async (resolve) => {
      let b;
      try {
        let b = await getNameExist(control.value);
        b ? resolve({nameexist: {reqName: control.value}}) : resolve(null);
      } catch (error) {
        resolve({cantcheckname: {error: error}});
      }
    });
  };


}
