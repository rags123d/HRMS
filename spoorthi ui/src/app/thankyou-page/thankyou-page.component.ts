import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thankyou-page',
  templateUrl: './thankyou-page.component.html',
  styleUrls: ['./thankyou-page.component.scss']
})
export class ThankyouPageComponent implements OnInit {

  public userName: any;
  
  public userDetails: any = '';
  
  constructor() { }

  ngOnInit(): void {
    this.userName = JSON.parse(sessionStorage.getItem('userDetails'))
    
    if (sessionStorage.getItem('userDetails') != null)
      this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

  }

}
