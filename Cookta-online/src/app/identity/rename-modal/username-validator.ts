import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';

export function UsernameValidator(getNameExist: (string) => Promise<boolean>): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors> | null => {
    return new Promise(async (resolve) => {
      let b = await getNameExist(control.value);
      console.log(b);
      b ? resolve({nameexist: {reqName: control.value}}) : resolve(null);
    });
  };


}
