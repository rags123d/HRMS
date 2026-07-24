import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private router: Router, private loginService: LoginService,private showLoaderService: NgxUiLoaderService, private toastr: ToastrService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = sessionStorage.getItem('accessToken');
        let cloned = req;
        if (token) {
            cloned = req.clone({
                headers: req.headers.set('Authorization', token)
            });
        }
        return <any>next.handle(cloned).pipe(catchError(err => {
            if ([401, 403].includes(err.status)) {
                return this.handle401Error(req, next);
            }
            return <any>throwError(err);
        }));
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            sessionStorage.setItem('accessToken', '');
            var param = {
                token: sessionStorage.getItem("refreshToken")
            }

            return this.loginService.RefreshToken(param).pipe(
            switchMap((res: any) => {
                sessionStorage.setItem('accessToken', res['token']);
                this.isRefreshing = false;
                this.refreshTokenSubject.next(res['token']);
                return next.handle(this.addToken(request, res['token']));
            }));

        } else {
            this.toastr.error("Unauthorized...");
            sessionStorage.removeItem('accessToken');
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigate(['/']);
            setTimeout(() => {
                location.reload();
            }, 100);
            return 0;
        }
    }

    addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({ setHeaders: { Authorization: token }})
    }

    // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //     const token = sessionStorage.getItem('accessToken');
    //     let cloned = req;
    //     if (token && !req.url.includes('account/token') && !location.pathname.includes('/profile')) {
    //         cloned = req.clone({
    //             headers: req.headers.set('Authorization', 'Bearer ' + token)
    //         });
    //     }
    //     return next.handle(cloned).pipe(catchError(err => {
    //         if ([401, 403].includes(err.status)) {
    //             // sessionStorage.setItem('accessToken', '');          
    //             const param = {
    //                 AccessToken: sessionStorage.getItem('accessToken'),
    //                 RefreshToken: sessionStorage.getItem("refreshToken")
    //             }
    //             console.log(param);
    //             this.loginService.RefreshToken(param).subscribe(
    //                 res => {   
    //                     console.log("refresh_token",  res); 
    //                     sessionStorage.removeItem('accessToken');
    //                     if (res['Success'] === true) {
    //                         sessionStorage.setItem('accessToken', res['Data'].AccessToken);
    //                         sessionStorage.setItem("refreshToken", res['Data'].RefreshToken);
    //                         this.showLoaderService.start();
    //                         location.reload();
    //                     }
    //                     else {
    //                         localStorage.clear();
    //                         sessionStorage.clear();
    //                         this.router.navigate(['/login']); 
    //                     }
    //                 },
    //                 error => {
    //                     localStorage.clear();
    //                     sessionStorage.clear();
    //                     this.router.navigate(['/login']);  
    //                     console.log(error);
    //                 }
    //             );  
    //             return throwError(err);
    //         }
    //         else if ([400,404,409,500,501].includes(err.status)) {   
    //             return throwError(err);
    //         } 
    //         this.showLoaderService.stop();
    //     }));
    // }



}
