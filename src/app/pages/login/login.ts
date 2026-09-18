import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
})
export class Login {
  constructor(private router: Router) {}

  goToProjects() {
    this.router.navigate(['/projects']);
  }
}
