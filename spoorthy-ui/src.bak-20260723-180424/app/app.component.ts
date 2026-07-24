import { Component } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sandbazaar';
  public scrollbarOptions = { axis: 'y', theme: 'dark'};
  public _path;

  constructor(
    public location: Location
  ) {}

  ngOnInit() {
    this._path = this.location.path().split('/')[1];
  }
}
