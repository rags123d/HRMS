import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(array: Array<string>, key: string): Array<string> {

      console.log("Entered in pipe*******  "+ key);


      if(key === undefined || key == '' ){
          return array;
      }

      var arr = key.split("-");
      var keyType = arr[0];   // type of column  to sort(string, number or  date)
      var sortOrder = arr[1];   // asc or desc order
      var keyString = arr[2];   // string or column name to sort
      var byVal = 1;
 
      array.sort((a: any, b: any) => {

          if(keyType === 'date' ){

              let left    = Number(new Date(a[keyString]));
              let right   = Number(new Date(b[keyString]));

              return (sortOrder === "asc") ? right - left : left - right;
          }
          else if(keyType === 'string'){

              if(a[keyString] < b[keyString]) {
                  return (sortOrder === "asc" ) ? -1*byVal : 1*byVal;
              } else if (a[keyString] > b[keyString]) {
                  return (sortOrder === "asc" ) ? 1*byVal : -1*byVal;
              } else {
                  return 0;
              }  
          }
          else if(keyType === 'number'){
              return (sortOrder === "asc") ? a[keyString] - b[keyString] : b[keyString] - a[keyString];
          }

      });

      return array;

}

}