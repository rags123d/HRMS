import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { Page } from '../page';


@Component({
  selector: 'app-custom-pagination',
  templateUrl: './custom-pagination.component.html',
  styleUrls: ['./custom-pagination.component.scss']
})
export class CustomPaginationComponent implements OnInit {
  @Input() page: Page<any>;
  @Output() nextPageEvent = new EventEmitter();
  @Output() firstPageEvent = new EventEmitter();
  @Output() previousPageEvent = new EventEmitter();
  @Output() lastPageEvent = new EventEmitter();
  @Output() pageSizeEvent: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  firstPage(): void {
    this.firstPageEvent.emit(null);
  }

  nextPage(): void {
    this.nextPageEvent.emit(null);
  }

  previousPage(): void {
    this.previousPageEvent.emit(null);
  }

  lastPage(): void {
    this.lastPageEvent.emit(null);
  }

  updatePageSize(pageSize: number): void {
    this.pageSizeEvent.emit(pageSize);
  }

}