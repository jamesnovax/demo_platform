import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  templateUrl: './splash.html',
})
export class Splash implements OnInit, OnDestroy {
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    // 展示 1.5 秒後自動跳轉到歡迎頁,實際專案可換成檢查登入狀態的邏輯
    this.timer = setTimeout(() => {
      this.router.navigate(['/welcome']);
    }, 1500);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  skip() {
    this.router.navigate(['/welcome']);
  }
}
