import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import {NotifierService} from "angular-notifier";
import {NotificationService} from "../../service/notification.service";
import {User} from "../../model/user";
import {Subscription} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {NotificationType} from "../../enum/notification-type";
import {HearderType} from "../../enum/hearder-type";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscription:Subscription[]=[]
  constructor(private router:Router, private authenticationService:AuthenticationService,
              private notifier:NotificationService) { }

  ngOnInit(): void {
    if(this.authenticationService.isUserLoggedIn()){
      this.router.navigate(['/user/management'])
    }else{
      this.router.navigate(['/login'])
    }
  }
  public onLogin(user: User): void {
    this.subscription.push(
      this.authenticationService.login(user).subscribe(
        (response) => {
          const token = response.headers.get(HearderType.JWT_TOKEN);
          this.authenticationService.saveToken(token!);
          this.authenticationService.addUserToLocalCache(response.body!);
          this.router.navigateByUrl('/user/management');
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription=>{
      subscription.unsubscribe()
    })
  }

  private sendErrorNotification(notificationType: NotificationType, message: string) {
    if(message){
      this.notifier.notify(notificationType,message)
    }else{
      this.notifier.notify(notificationType,"WE HAVE AN ERROR PLEASE TRY AGAIN")
    }
  }
}
