import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-auth-handle',
  standalone: true,  // Declares this as a standalone component
  imports: [CommonModule],
  template: '', // No template required for this logic
})
export class AuthConfirmation {
  constructor(private route: ActivatedRoute, private router: Router) {
    // Extract the 'code' query parameter from the URL
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      // Call window.opener.authenticateCallback with the code
      window.opener.authenticateCallback(code);
    }
  }
}
