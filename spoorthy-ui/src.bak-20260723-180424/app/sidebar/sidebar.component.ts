import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoginService } from '../shared/http/login.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @ViewChild('myButton') myButton: ElementRef;

  shareForm: FormGroup;

  public scrollbarOptions = { axis: 'y', theme: 'dark' };
  public userName: any;

  public userDetails: any = '';

  modalRef: BsModalRef;
  isButtonDisabled = false;
  isModalOpen = false;
  formSubmitted: boolean;
  linkURL: string;
  // [x: string]: any;
  // PhoneNo: string = '';
  // Name: string = '';

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private showLoaderService: NgxUiLoaderService,
    private loginService: LoginService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.userName = JSON.parse(sessionStorage.getItem('userDetails'))
    this.shareForm = new FormGroup({
      Name: new FormControl("", [Validators.required]),
      PhoneNo: new FormControl("", [Validators.required, Validators.pattern("[0-9]{10}")]),
    });

    if (sessionStorage.getItem('userDetails') != null)
      this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

    setTimeout(() => {
      this.onAjax();
    }, 1000);

  }

  onAjax() {
    $("aside nav ul li").on('click', function () {
      $(this).parent().find('>li').removeClass('active').addClass('inactive');
      $(this).removeClass('inactive').addClass('active');
      $(this).parent().find('li.inactive').find('ul.sub-menu').removeClass('active');
      $(this).find('ul.sub-menu').toggleClass('active');
      $(this).removeClass('active').toggleClass('active');
    });

    // $("aside nav ul li").on('click', function () {
    //   $(this).parent().toggleClass('open-menu').siblings('.sub-menu').removeClass('open-menu');
    // });

    // $("aside nav ul li").on('click', function () {
    //   $(this).parent().addClass('active').siblings('.sub-menu').removeClass('active');
    // });

    // $("aside nav ul li").on('click', function () {
    //   $(this).parent().addClass('active').siblings().removeClass('active');
    //   $(this).parent().toggleClass('open-menu').siblings().removeClass('open-menu');
    // });

  }

  // onAjax() {
  //   var dropdown = document.getElementsByClassName("dropdown-btn");
  //   var i;

  //   for (i = 0; i < dropdown.length; i++) {
  //     dropdown[i].addEventListener("click", function () {
  //       this.classList.toggle("active");
  //       var dropdownContent = this.nextElementSibling;
  //       if (dropdownContent.style.display === "block") {
  //         dropdownContent.style.display = "none";
  //       } else {
  //         dropdownContent.style.display = "block";
  //       }
  //     });
  //   }
  // }

  onLogout() {
    sessionStorage.removeItem('userDetails');
    sessionStorage.removeItem('accessToken');
    this.router.navigate(['login']);
  }


  OpenlinkModel(template: TemplateRef<any>) {
    this.formSubmitted = false;
    this.shareForm.reset();

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
    this.isButtonDisabled = true;
    this.isModalOpen = true;

    this.modalRef.onHidden.subscribe(() => {
      this.isButtonDisabled = false;
      this.isModalOpen = false;
    });
  }

  updateButton() {
    // if (!this.Name || !this.PhoneNo) {
    let formVal = this.shareForm.value;
    if (!formVal.Name || !formVal.PhoneNo) {
      this.disableButton();
    } else {
      this.enableButton();
    }
  }

  enableButton() {
    this.myButton.nativeElement.disabled = false;
  }

  disableButton() {
    this.myButton.nativeElement.disabled = true;
  }

  generateUrl(event: Event) {
    event.preventDefault();

    let formVal = this.shareForm.value;
    // const queryParams = { name: formVal.Name, phoneNo: formVal.PhoneNo };
    // const url = this.router.createUrlTree(['/openlinkForm'], { queryParams }).toString();
    window.open(`/openlinkForm?name=${formVal.Name}&phoneNo=${formVal.PhoneNo}`, '_blank');
  }

  shareLink() {
    let formVal = this.shareForm.value;
    const queryParams = { name: formVal.Name, phoneNo: formVal.PhoneNo };
    const url = this.router.createUrlTree(['/openlinkForm'], { queryParams }).toString();
    this.linkURL = url
    // window.open(url, '_blank');

    var param = {
      name: formVal.Name,
      phoneNo: formVal.PhoneNo,
      sharelink: this.linkURL,
    }
    this.showLoaderService.start();
    this.loginService.SendSMS(param)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.toastr.success("SMS sent Successfully!");
            this.modalRef.hide();
            this.showLoaderService.stop();
            this.router.navigate(['dashboard']);
          } else {
            this.showLoaderService.stop();
            this.toastr.error(res['message']);
          }
        },
        error => {
          console.log(error);
          this.showLoaderService.stop();
          this.toastr.error(error.error.message);
        }
      );
  }


}
