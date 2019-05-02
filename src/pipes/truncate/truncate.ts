import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TruncatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  /**
   * Takes a value and truncates it by number of words
   */
  transform(value: string, limit: number = 255, trail: string = '…') {
    var result = value || '';
    var slice_index;

    var index_newline = Math.min(result.indexOf("\n", limit));
    var index_space = Math.min(result.indexOf(" ", limit));

    if (index_space < 0 && index_newline < 0) {
      return result;
    } else if (index_space < 0) {
      slice_index = index_newline;
    } else if (index_newline < 0) {
      slice_index = index_space;
    } else {
      slice_index = Math.min(index_newline, index_space);
    }
    result = result.slice(0, slice_index)+trail;

    return result;
  }
}
