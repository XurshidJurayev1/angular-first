import {Component} from '@angular/core';
import {environmentDev} from "../../../envirenment/envirement";
import {LoginService} from "../../services/login.service";
import {HttpClientModule} from "@angular/common/http";

declare global {
  interface Window {
    authenticateCallback: (code: string) => Promise<void>; // Define the type for the callback
  }
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  providers: [LoginService]
})
export class LoginPageComponent {
  public CLIENT_ID: string = environmentDev.SSO_CLIENT_ID
  public SSO_URL: string = environmentDev.SSO_URL
  public protocol: string = window.location.protocol;
  public host: string = window.location.host;
  public createdPath!: string;
  public oauthPopup: Window | null = null

  constructor(public loginService: LoginService) {
  }

  public openPopUp(options: any) {
    const width = 800;
    const height = 800;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    options.windowName = options.windowName || 'ConnectWithOAuth'; // should not include space for IE
    options.windowOptions =
      options.windowOptions ||
      `toolbar=no, location=no, directories=no, status=no, menubar=no,width=${width},height=${height}, top=${top}, left=${left}`;
    this.oauthPopup = window.open(options.path, options.windowName, options.windowOptions);
    window.authenticateCallback = async (code: any) => {
      this.closePopup()
      options.callback(code);
    };
  }

  closePopup(): void {
    if (this.oauthPopup) {
      this.oauthPopup.close();
      this.oauthPopup = null;
    }
  }

  public loginHandler() {
    localStorage.clear();
    this.createdPath = `${this.SSO_URL}/oauth/authorize?response_type=code&client_id=${this.CLIENT_ID}&redirect_uri=${`${this.protocol}//${this.host}`}/confirmation-required`;
    this.openPopUp({
      path: this.createdPath,
      callback: (code: any) => {
        console.log(code)
        this.loginService.authenticateAndGetToken(code)
      }
    })
  }
}
