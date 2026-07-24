import { Injectable } from '@angular/core';
import { Page } from '../pagination/page';
import { Pageable } from '../pagination/pageable';

@Injectable({
  providedIn: 'root'
})
export class CustomPaginationService {

  constructor() { }

  //getting next page
  public getNextPage(page: Page<any>): Pageable {
    if(!page.last) {
      page.pageable.pageNumber = page.pageable.pageNumber+1;
    }
    return page.pageable;
  }

    //getting Previous page
  public getPreviousPage(page: Page<any>): Pageable {
    if(!page.first) {
      page.pageable.pageNumber = page.pageable.pageNumber-1;
    }
    return page.pageable;
  }

    //getting next page
    public getFirstPage(page: Page<any>): Pageable {
      
        page.pageable.pageNumber = 0;
     
      return page.pageable;
    }
  
      //getting Previous page
    public getLastPage(page: Page<any>): Pageable {
      
      page.pageable.pageNumber = page.totalPages;
      return page.pageable;
    }
    
    // page size
  public getPageInNewSize(page: Page<any>, pageSize: number): Pageable {
    page.pageable.pageSize = pageSize;
    page.pageable.pageNumber = Pageable.FIRST_PAGE_NUMBER;
 
    return page.pageable;
  }
}