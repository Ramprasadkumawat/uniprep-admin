import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { MessageService } from "primeng/api";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { AuthService } from "../Auth/auth.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private static isLoggingOut = false;

  constructor(
    private toastr: MessageService,
    private ngxService: NgxUiLoaderService,
    private authService: AuthService
  ) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.ngxService.start();
    return next.handle(request).pipe(
      tap((res: any) => {
        if (res.status && !request.url.includes("/api/selectoptions")) {
          this.ngxService.stop();
        }
      }),
      catchError((err: any) => {
        this.ngxService.stop();
        const errorMessage =
          err?.error?.message || err?.error?.error?.message || "";
        let finalMessage = errorMessage;

        // Handle 422 errors
        if (err?.status === 422 || err?.error?.status === false || err?.error?.success === false) {

          const errors =
            err?.error?.errors ||
            (typeof err?.error?.message === 'object' ? err.error.message : null);
          setTimeout(() => {
            if (errors) {
              Object.keys(errors).forEach((field) => {
                errors[field].forEach((msg: string) => {
                  this.toastr.add({
                    severity: "error",
                    summary: "Error",
                    detail: msg,
                  });
                });
              });
            } else {
              this.toastr.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error?.message || err.message || finalMessage,
              });
            }
          }, 1000);
          return throwError(() => err);
        }

        // Handle 401 errors
        if (err?.status === 401) {
          const errorMessage =
            err?.error?.message || err?.error?.error?.message || "";

          // Check if it's "Incorrect Username or Password" error
          if (
            errorMessage
              .toLowerCase()
              .includes("incorrect username or password")
          ) {
            this.ngxService.stop();
            this.toastr.add({
              severity: "error",
              summary: "Error",
              detail: errorMessage || "Incorrect Username or Password",
            });
            return throwError(
              () => new Error(errorMessage || "Incorrect Username or Password")
            );
          }

          // Handle token expired/blacklisted error - prevent multiple logout calls
          if (HttpErrorInterceptor.isLoggingOut) {
            // Already processing logout, just return error silently
            return throwError(() => new Error("Token expired or blacklisted"));
          }

          // Handle token blacklisted error
          const isTokenBlacklisted =
            errorMessage.toLowerCase().includes("token has been blacklisted") ||
            errorMessage.toLowerCase().includes("tokenblacklistedexception") ||
            err?.error?.exception?.includes("TokenBlacklistedException");

          // Set flag to prevent multiple logout calls
          HttpErrorInterceptor.isLoggingOut = true;

          this.ngxService.stop();
          // Show token expired/blacklisted message (only once)
          this.toastr.add({
            severity: "error",
            summary: "Session Expired",
            detail: isTokenBlacklisted
              ? "Your session has been invalidated. Please login again."
              : "Your session has expired. Please login again.",
          });
          // Call logout to clear storage and navigate to login
          this.authService.logout();

          // Reset flag after a delay to allow for future logouts if needed
          setTimeout(() => {
            HttpErrorInterceptor.isLoggingOut = false;
          }, 2000);

          return throwError(() => new Error("Token expired or blacklisted"));
        }

        // Handle 408 Request Timeout errors
        if (err?.status === 408) {
          this.ngxService.stop();
          this.toastr.add({
            severity: "error",
            summary: "Session Timeout",
            detail:
              "Request timeout. Your session has expired. Please login again.",
          });
          // Call logout to clear storage and navigate to login
          this.authService.logout();
          return throwError(() => new Error("Request timeout"));
        }

        // Handle other errors
        this.toastr.add({
          severity: "error",
          summary: "Error",
          detail: finalMessage,
        });
        return throwError(() => err);
      })
    );
  }
}
