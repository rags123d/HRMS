import { FormControl } from '@angular/forms';

export function requiredFileType( types: string[] ) {
    // return function (control: FormControl):{[s:string]:boolean} { //as per toutorial
    return function (control: FormControl):{[s:string]:boolean} {
      const file = control.value;
      if ( file ) {
        var fileName = file.name.substring(file.name.lastIndexOf('/') + 1);
        var ext = fileName.split('.');
        //const extension = file.name.split('.')[1].toLowerCase();
        //const extArray = ["exe","doc","docx","txt","gif","xls","xlsx","bat","msi","png","jpg","jpeg","pdf"]

        let isTrue = true;
        //const filteredArray = types.filter(value => extArray.includes(value));

        ext.forEach((type, i) => {
          if(i != 0){
            if(!types.includes(type)){
              isTrue = false;
           }
          }
          // else if ( type.toLowerCase() == extension.toLowerCase() ) {
          //   isTrue = true;
          // }
        });

        if(isTrue)
          return null;
        else{
          return {
            requiredFileType: true
          };
        }
      

        // if ( type.toLowerCase() !== extension.toLowerCase() ) {
        //   return {
        //     requiredFileType: true
        //   };
        // }
        
      //  return null;
      }
  
      return null;
    };
  }