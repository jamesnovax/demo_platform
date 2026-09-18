import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

interface AlertItem {
  id: number;
  level: 'info' | 'warning' | 'urgent';
  text: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  online: boolean;
}

interface MessageItem {
  id: number;
  from: string;
  text: string;
  time: string;
}

interface CalendarEvent {
  id: number;
  day: number; // 當月第幾天
  title: string;
  time: string;
}

interface CalendarCell {
  day: number;
  isToday: boolean;
  events: CalendarEvent[];
}

interface ProjectSummary {
  id: number;
  name: string;
  progress: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  // 以下皆為展示用假資料,之後可改為呼叫對應的 API
  projects: ProjectSummary[] = [
    { id: 1, name: '網站改版專案', progress: 72 },
    { id: 2, name: '行動 App 開發', progress: 40 },
    { id: 3, name: '內部工具整合', progress: 15 },
  ];

  todos: TodoItem[] = [
    { id: 1, text: '確認 API 規格文件', done: true },
    { id: 2, text: '審查前端登入流程', done: false },
    { id: 3, text: '準備週會簡報', done: false },
    { id: 4, text: '回覆廠商報價信', done: false },
  ];

  events: CalendarEvent[] = [
    { id: 1, day: 18, title: '專案進度週會', time: '10:00 - 11:00' },
    { id: 2, day: 22, title: '設計稿審查', time: '14:30 - 15:30' },
    { id: 3, day: 25, title: '客戶展示 Demo', time: '16:00 - 17:00' },
  ];

  team: TeamMember[] = [
    { id: 1, name: '陳雨潔', role: '專案經理', online: true },
    { id: 2, name: '林柏宇', role: '前端工程師', online: true },
    { id: 3, name: '黃芷晴', role: '後端工程師', online: false },
    { id: 4, name: '王冠廷', role: 'UI/UX 設計師', online: false },
  ];

  alerts: AlertItem[] = [
    { id: 1, level: 'urgent', text: '「行動 App 開發」專案已逾期 2 天' },
    { id: 2, level: 'warning', text: '3 項任務即將於今日到期' },
    { id: 3, level: 'info', text: '系統將於本週六進行例行維護' },
  ];

  messages: MessageItem[] = [
    { id: 1, from: '陳雨潔', text: '這週的進度報告麻煩今天前給我', time: '10:24' },
    { id: 2, from: '林柏宇', text: '登入頁的 API 已經串接完成', time: '09:47' },
    { id: 3, from: '黃芷晴', text: '資料庫欄位有個地方想跟你確認', time: '昨天' },
  ];

  weekdayLabels = ['日', '一', '二', '三', '四', '五', '六'];
  monthLabel = '';
  calendarWeeks: (CalendarCell | null)[][] = [];

  constructor() {
    this.buildCalendar();
  }

  private buildCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-based

    this.monthLabel = `${year} 年 ${month + 1} 月`;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = new Date(year, month, 1).getDay(); // 0=週日
    const eventsByDay = new Map<number, CalendarEvent[]>();
    for (const e of this.events) {
      const list = eventsByDay.get(e.day) ?? [];
      list.push(e);
      eventsByDay.set(e.day, list);
    }

    const cells: (CalendarCell | null)[] = [];

    // 該月第一天之前的空白格
    for (let i = 0; i < firstWeekday; i++) {
      cells.push(null);
    }

    // 當月每一天
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        isToday: d === today.getDate(),
        events: eventsByDay.get(d) ?? [],
      });
    }

    // 補滿最後一週的空白格
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    const weeks: (CalendarCell | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    this.calendarWeeks = weeks;
  }

  get completedCount(): number {
    return this.todos.filter((t) => t.done).length;
  }
}
