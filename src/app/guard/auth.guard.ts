import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from "../service/authentication.service";
import {NotificationService} from "../service/notification.service";
import {NotificationType} from "../enum/notification-type";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authenticationService:AuthenticationService,private router:Router,
              private notificationService:NotificationService) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  private isUserLoggedIn():boolean{
    if(this.authenticationService.isUserLoggedIn()){
      return true
    }
    this.router.navigate(['/login'])
    //send notification to user
    this.notificationService.notify(NotificationType.ERROR, `You need to log in to access this page`)
    return false
  }
}
