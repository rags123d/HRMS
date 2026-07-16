import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../shared/http/profile.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public ProfileForm: FormGroup;
  public userDetails = sessionStorage.getItem('userDetails') as any;
  public accessToken = sessionStorage.getItem('accessToken');
  public newUserNumber = sessionStorage.getItem('NewUserNumber');
  public CurrPath = location.pathname;
  public LoginUserDetails;
  public IsNewUser = false;

  constructor(    private router: Router,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private showLoaderService: NgxUiLoaderService) { }

  ngOnInit() {
    this.CurrPath = this.router.url;
    this.ProfileForm = new FormGroup({
      Id: new FormControl(null, [Validators.required]),
      UserName: new FormControl(null, [Validators.required]),
      Email: new FormControl(null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])
    });
    this.LoginUserDetails = JSON.parse(this.userDetails);
    if(this.LoginUserDetails.Data != null){
      this.ProfileForm.controls.Id.setValue(this.LoginUserDetails.Data.User.Id);
      this.ProfileForm.controls.UserName.setValue(this.LoginUserDetails.Data.User.UserName);
      this.ProfileForm.controls.Email.setValue(this.LoginUserDetails.Data.User.Email);
      this.IsNewUser = true;
    }
  }

  SaveChanges(){
    this.showLoaderService.start();
    this.profileService.UpdateProfile(this.ProfileForm.value)
      .subscribe(
        res => {
          debugger
          this.showLoaderService.stop();
          if (res['Data']) {
            this.LoginUserDetails.Data.User.Email = res['Data'].User.Email;
            sessionStorage.setItem('userDetails', JSON.stringify(this.LoginUserDetails));
            this.toastr.success('Profile Updated Successfully');
          } else {
            this.toastr.error(res['Message']);
          }
        },
        error => {
          console.log(error);
          this.showLoaderService.stop();
          this.toastr.error(error.error.Data.Message);
        }
      );
  }

}
