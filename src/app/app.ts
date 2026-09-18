import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = '協作專案平台';

  // 展示用:之後可改為從登入 API 回傳的使用者資料
  protected currentUserName = '陳雨潔';

  constructor(private router: Router) {}

  logout() {
    // 之後可在此加上清除 token / session 的邏輯
    this.router.navigate(['/welcome']);
  }
}
