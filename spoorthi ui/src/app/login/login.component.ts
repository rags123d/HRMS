import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from '../shared/http/login.service';
import { TransitionsService } from '../shared/non-http/transitions.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public ForgotForm: FormGroup;
  public IsPopUp = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private transitionService: TransitionsService,
    private toastr: ToastrService,
    private showLoaderService: NgxUiLoaderService
  ) { }

  ngOnInit() {

    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#id_password');

    togglePassword.addEventListener('click', function (e) {
      // toggle the type attribute
      const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
      password.setAttribute('type', type);
      // toggle the eye slash icon
      this.classList.toggle('fa-eye-slash');
    });

    this.loginForm = new FormGroup({
      UserName: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]),
      Password: new FormControl(null, Validators.required),
      Role: new FormControl('superadmin')
    });
    this.ForgotForm = new FormGroup({
      UserName: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]),
      Email: new FormControl(null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])
    });
    if (sessionStorage.getItem('accessToken') != null) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin() {
    //without api call
    // setTimeout(() => {
    //   sessionStorage.setItem('accessToken', "dfdxgh3xf5h365fh");
    //   this.router.navigate(['dashboard']);
    // }, 500);

    //api call
    var param = {
      userName: btoa(this.loginForm.controls.UserName.value),
      password: btoa(this.loginForm.controls.Password.value)
    }
    this.showLoaderService.start();
    this.loginService.onLogin(param)
      .subscribe(
        res => {
          if (res['success'] === true) {
            sessionStorage.setItem('userDetails', JSON.stringify(res['data']));
            sessionStorage.setItem('accessToken', res['data'].accessToken);
            sessionStorage.setItem('refreshToken', res['data'].refreshToken);
            this.showLoaderService.stop();
            if (res['data'].role == 'Field Officer') {
              this.router.navigate(['/allcandidate/overview/employee/add']);
            }
            else {
              this.router.navigate(['/dashboard']);
            }
          } else {
            this.showLoaderService.stop();
            this.toastr.error(res['message']);
          }
        },
        error => {
          console.log(error);
          this.showLoaderService.stop();
          this.toastr.error('Invalid Credentials!');
        }
      );
  }

  OpenModel() {
    this.IsPopUp = true;
  }

  closeModel() {
    this.IsPopUp = false;
    this.ForgotForm.reset();
  }

  Submit() {
    var param = {
      userName: btoa(this.ForgotForm.controls.UserName.value),
      email: btoa(this.ForgotForm.controls.Email.value)
    }
    this.showLoaderService.start();
    this.loginService.ForgotPassword(param)
      .subscribe(
        res => {
          this.showLoaderService.stop();
          if (res['success'] === true) {
            this.closeModel();
            console.log(res['data'])
            this.toastr.success(res['message']);
          } else {
            this.toastr.error(res['message']);
          }
        },
        error => {
          console.log(error);
          this.showLoaderService.stop();
          this.toastr.error(error.error.Data.Message);
        }
      );
  }

  onPaste(event: ClipboardEvent) {
    setTimeout(() => {
      this.loginForm.get('Password').reset();
    }, 10);
  }

}
