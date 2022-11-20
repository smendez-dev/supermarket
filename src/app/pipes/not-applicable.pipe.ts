import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notApplicable'
})
export class NotApplicablePipe implements PipeTransform {
  transform(value: string): string {
    return !value ? 'N/A' : value;
  }
}

