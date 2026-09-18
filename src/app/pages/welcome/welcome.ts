import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './welcome.html',
})
export class Welcome {
  email = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    // 展示用:之後改為呼叫 POST /api/login,成功後再導向 dashboard
    this.router.navigate(['/dashboard']);
  }
}
