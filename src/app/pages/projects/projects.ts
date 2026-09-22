import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ProjectList } from './projectlist/projectlist';

import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray
} from '@angular/cdk/drag-drop';

type StatusLevel = 'green' | 'yellow' | 'red';

type TaskStatus =
  | '未開始'
  | '進行中'
  | '已完成'
  | '延遲';

interface ProjectItem {
  id: number;
  name: string;
  status: string;
  level: StatusLevel;
}

interface TaskProgressReport {
  id: number;
  reportDate: string; // 回報日期(顯示用字串,例如 '9/16')
  completedPart: string; // 工作完成部分
  incompletePart: string; // 未完成部分
  inProgressPart: string; // 正進行中部分
  difficulty: string; // 困難點
  solution: string; // 解決方案
  suggestion: string; // 建議事項
  estimatedProgress: number; // 預估進度 0-100
}

interface ProjectTask {
  id: number;
  title: string;
  assignee: string;
  status: TaskStatus;
  startDay: number;
  endDay: number;
  reports: TaskProgressReport[];
}

interface DiscussionNote {
  id: number;
  author: string;
  snippet: string;
  time: string;
}

interface ProjectDetailData {
  timelineLength: number;
  startDate: string; // 甘特圖時間軸的起始日期(ISO 格式),第 1 天對應這個日期
  tasks: ProjectTask[];
  discussions: DiscussionNote[];
}

type DashboardPanelId =
  | 'tasks'
  | 'gantt'
  | 'discussion';

interface DashboardPanel {
  id: DashboardPanelId;
  name: string;
  visible: boolean;
}

type TaskViewPanelId =
  | 'info'
  | 'progress'
  | 'timeline';

interface TaskViewPanel {
  id: TaskViewPanelId;
  name: string;
  visible: boolean;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    FormsModule,
    DragDropModule,
    ProjectList
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {

  projects: ProjectItem[] = [
    {
      id: 1,
      name: '網站改版專案',
      status: '進度正常',
      level: 'green'
    },
    {
      id: 2,
      name: '行動 App 開發',
      status: '已逾期 2 天',
      level: 'red'
    },
    {
      id: 3,
      name: '內部工具整合',
      status: '風險待觀察',
      level: 'yellow'
    },
  ];

  private detailsByProjectId: Record<number, ProjectDetailData> = {

    1: {
      timelineLength: 20,
      startDate: '2026-09-01',

      tasks: [
        {
          id: 1,
          title: '首頁視覺設計',
          assignee: '王冠廷',
          status: '已完成',
          startDay: 1,
          endDay: 5,
          reports: []
        },
        {
          id: 2,
          title: '前端切版',
          assignee: '林柏宇',
          status: '進行中',
          startDay: 4,
          endDay: 12,
          reports: [
            {
              id: 1,
              reportDate: '9/8',
              completedPart: '首頁與專案列表頁的靜態切版已完成',
              incompletePart: '專案詳情頁、儀表板頁尚未開始',
              inProgressPart: '正在切專案詳情頁的版面',
              difficulty: '',
              solution: '',
              suggestion: '',
              estimatedProgress: 30
            },
            {
              id: 2,
              reportDate: '9/15',
              completedPart: '專案詳情頁、儀表板頁靜態切版完成',
              incompletePart: '響應式手機版尚未調整',
              inProgressPart: '正在處理手機版的版面配置',
              difficulty: '手機版在窄螢幕下側邊選單會擋住內容',
              solution: '改用抽屜式選單,窄螢幕時預設收合',
              suggestion: '建議下次設計稿一開始就附上手機版規格,避免後補',
              estimatedProgress: 65
            }
          ]
        },
        {
          id: 3,
          title: 'API 串接',
          assignee: '黃芷晴',
          status: '進行中',
          startDay: 8,
          endDay: 16,
          reports: []
        },
        {
          id: 4,
          title: '驗收測試',
          assignee: '陳雨潔',
          status: '未開始',
          startDay: 16,
          endDay: 20,
          reports: []
        },
      ],

      discussions: [
        {
          id: 1,
          author: '陳雨潔',
          snippet: '首頁視覺這版客戶已經確認,可以直接進切版',
          time: '2 天前'
        },
        {
          id: 2,
          author: '林柏宇',
          snippet: '響應式在手機版還有一個 bug 在修',
          time: '昨天'
        },
        {
          id: 3,
          author: '黃芷晴',
          snippet: '會員 API 規格已更新,請看最新文件',
          time: '3 小時前'
        },
      ],
    },

    2: {
      timelineLength: 24,
      startDate: '2026-08-20',

      tasks: [
        {
          id: 1,
          title: '需求訪談',
          assignee: '陳雨潔',
          status: '已完成',
          startDay: 1,
          endDay: 4,
          reports: []
        },
        {
          id: 2,
          title: 'UI 原型設計',
          assignee: '王冠廷',
          status: '已完成',
          startDay: 3,
          endDay: 10,
          reports: []
        },
        {
          id: 3,
          title: 'App 前端開發',
          assignee: '林柏宇',
          status: '延遲',
          startDay: 9,
          endDay: 22,
          reports: [
            {
              id: 1,
              reportDate: '8/30',
              completedPart: '登入、註冊畫面開發完成',
              incompletePart: '金流串接、訂單畫面尚未開始',
              inProgressPart: '正在開發金流串接的前端介面',
              difficulty: '第三方金流 SDK 文件不齊全,測試環境一直串不通',
              solution: '已請廠商提供最新版文件,並約了技術支援通話',
              suggestion: '建議之後選金流廠商前,先確認文件與測試環境是否完整',
              estimatedProgress: 40
            }
          ]
        },
        {
          id: 4,
          title: '後端 API 開發',
          assignee: '黃芷晴',
          status: '進行中',
          startDay: 9,
          endDay: 20,
          reports: []
        },
      ],

      discussions: [
        {
          id: 1,
          author: '林柏宇',
          snippet: '第三方金流 SDK 文件不齊全,進度有點卡住',
          time: '1 天前'
        },
        {
          id: 2,
          author: '陳雨潔',
          snippet: '已經跟廠商反應,今天會有新版文件',
          time: '5 小時前'
        },
      ],
    },

    3: {
      timelineLength: 16,
      startDate: '2026-09-08',

      tasks: [
        {
          id: 1,
          title: '盤點現有工具',
          assignee: '黃芷晴',
          status: '已完成',
          startDay: 1,
          endDay: 4,
          reports: []
        },
        {
          id: 2,
          title: '整合方案設計',
          assignee: '陳雨潔',
          status: '進行中',
          startDay: 4,
          endDay: 10,
          reports: []
        },
        {
          id: 3,
          title: '試點導入',
          assignee: '林柏宇',
          status: '未開始',
          startDay: 10,
          endDay: 16,
          reports: []
        },
      ],

      discussions: [
        {
          id: 1,
          author: '黃芷晴',
          snippet: '有兩套工具功能重疊,想討論要留哪一套',
          time: '4 小時前'
        },
      ],
    },

  };

  selectedId!: number;
  viewingTask: ProjectTask | null = null;

  readonly statusOptions: TaskStatus[] = [
    '未開始',
    '進行中',
    '已完成',
    '延遲'
  ];

  showModal = false;

  modalMode: 'add' | 'edit' = 'add';

  private editingTaskId: number | null = null;

  formTask: {
    title: string;
    assignee: string;
    status: TaskStatus;
    startDay: number;
    endDay: number;
  } = this.emptyForm();

  panels: DashboardPanel[] = [
    {
      id: 'tasks',
      name: '任務列表',
      visible: true
    },
    {
      id: 'gantt',
      name: '時程甘特圖',
      visible: true
    },
    {
      id: 'discussion',
      name: '討論節錄',
      visible: true
    }
  ];

  panelOrder: DashboardPanelId[] = [
    'tasks',
    'gantt',
    'discussion'
  ];

  taskViewPanels: TaskViewPanel[] = [
    {
      id: 'info',
      name: '基本資訊',
      visible: true
    },
    {
      id: 'progress',
      name: '目前進度',
      visible: true
    },
    {
      id: 'timeline',
      name: '進度回報時間軸',
      visible: true
    }
  ];

  taskViewPanelOrder: TaskViewPanelId[] = [
    'info',
    'progress',
    'timeline'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    const paramId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.selectedId =
      this.projects.some(
        p => p.id === paramId
      )
        ? paramId
        : this.projects[0].id;
  }
   // ⭕ 關鍵修正：將引數 id 的型態放寬為與子元件相同的 string | number
  select(id: string | number): void {
    // 強制將傳進來的資料轉化為 number 數字型態
    const numericId = Number(id);

    this.selectedId = numericId;
    this.viewingTask = null;

    this.router.navigate([
      '/projects',
      numericId
    ]);
  }

  

  get selectedProject(): ProjectItem {
    return this.projects.find(
      p => p.id === this.selectedId
    )!;
  }

  get breadcrumbs(): string[] {
    const crumbs = ['專案列表', this.selectedProject.name];

    if (this.viewingTask) {
      crumbs.push(this.viewingTask.title, '查看');
      return crumbs;
    }

    if (this.showModal) {
      const taskLabel = this.modalMode === 'add' ? '新增任務' : (this.formTask.title || '任務');
      crumbs.push(taskLabel);

      if (this.modalMode === 'edit') {
        crumbs.push('編輯');
      }
    }

    return crumbs;
  }

  get selectedDetail(): ProjectDetailData {
    return this.detailsByProjectId[
      this.selectedId
    ];
  }

  taskBarStyle(
    task: ProjectTask
  ): {
    left: string;
    width: string;
  } {
    const total =
      this.selectedDetail.timelineLength;

    const left =
      ((task.startDay - 1) / total) * 100;

    const width =
      ((task.endDay - task.startDay) / total) * 100;

    return {
      left: `${left}%`,
      width: `${width}%`
    };
  }

  get ganttDays(): Date[] {
    const total = this.selectedDetail.timelineLength;
    const start = new Date(this.selectedDetail.startDate);
    const days: Date[] = [];

    for (let i = 0; i < total; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      days.push(d);
    }

    return days;
  }

  viewTask(task: ProjectTask): void {
    this.viewingTask = task;

    this.taskViewPanels.forEach(
      panel => (panel.visible = true)
    );
    this.taskViewPanelOrder = [
      'info',
      'progress',
      'timeline'
    ];
  }

  closeTaskView(): void {
    this.viewingTask = null;
  }

  private dateFromDay(day: number): Date {
    const start = new Date(this.selectedDetail.startDate);
    const d = new Date(start);
    d.setDate(d.getDate() + (day - 1));
    return d;
  }

  taskDateRangeLabel(task: ProjectTask): string {
    const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
    return `${fmt(this.dateFromDay(task.startDay))} - ${fmt(this.dateFromDay(task.endDay))}`;
  }

  latestReport(task: ProjectTask): TaskProgressReport | null {
    return task.reports.length ? task.reports[task.reports.length - 1] : null;
  }

  reportsNewestFirst(task: ProjectTask): TaskProgressReport[] {
    return [...task.reports].reverse();
  }

  deleteTask(task: ProjectTask): void {
    const list =
      this.selectedDetail.tasks;

    const index =
      list.findIndex(
        t => t.id === task.id
      );

    if (index > -1) {
      list.splice(index, 1);
    }
  }

  private emptyForm() {
    return {
      title: '',
      assignee: '',
      status: '未開始' as TaskStatus,
      startDay: 1,
      endDay: 2
    };
  }

  openAddModal(): void {
    this.modalMode = 'add';
    this.editingTaskId = null;
    this.formTask = this.emptyForm();
    this.showModal = true;
  }

  openEditModal(task: ProjectTask): void {
    this.modalMode = 'edit';
    this.editingTaskId = task.id;

    this.formTask = {
      title: task.title,
      assignee: task.assignee,
      status: task.status,
      startDay: task.startDay,
      endDay: task.endDay
    };

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
  
  saveTask(): void {
    const list =
      this.selectedDetail.tasks;

    if (this.modalMode === 'add') {

      const nextId =
        list.length
          ? Math.max(
              ...list.map(t => t.id)
            ) + 1
          : 1;

      list.push({
        id: nextId,
        ...this.formTask,
        reports: []
      });

    } else if (
      this.editingTaskId !== null
    ) {

      const target =
        list.find(
          t =>
            t.id ===
            this.editingTaskId
        );

      if (target) {
        Object.assign(
          target,
          this.formTask
        );
      }
    }

    this.showModal = false;
  }

  get orderedPanels(): DashboardPanel[] {
    return this.panelOrder
      .map(id =>
        this.panels.find(
          panel => panel.id === id
        )
      )
      .filter(
        (
          panel
        ): panel is DashboardPanel =>
          !!panel
      );
  }

  get hiddenPanels(): DashboardPanel[] {
    return this.panels.filter(
      panel => !panel.visible
    );
  }

  get visiblePanelOrder(): DashboardPanelId[] {
    return this.panelOrder.filter(
      id => {
        const panel =
          this.panels.find(
            p => p.id === id
          );

        return !!panel?.visible;
      }
    );
  }

  hidePanel(
    id: DashboardPanelId
  ): void {
    const panel =
      this.panels.find(
        p => p.id === id
      );

    if (panel) {
      panel.visible = false;
    }
  }

  restorePanel(id: string): void {
    if (!id) {
      return;
    }

    const panel =
      this.panels.find(
        p => p.id === id
      );

    if (panel) {
      panel.visible = true;
    }
  }

  movePanelUp(
    id: DashboardPanelId
  ): void {
    const index =
      this.panelOrder.indexOf(id);

    if (index <= 0) {
      return;
    }

    moveItemInArray(
      this.panelOrder,
      index,
      index - 1
    );
  }

  movePanelDown(
    id: DashboardPanelId
  ): void {
    const index =
      this.panelOrder.indexOf(id);

    if (
      index < 0 ||
      index >=
        this.panelOrder.length - 1
    ) {
      return;
    }

    moveItemInArray(
      this.panelOrder,
      index,
      index + 1
    );
  }

  dropPanel(
    event: CdkDragDrop<DashboardPanelId[]>
  ): void {

    const visibleIds =
      this.visiblePanelOrder;

    const movedId =
      visibleIds[event.previousIndex];

    const targetId =
      visibleIds[event.currentIndex];

    if (
      !movedId ||
      !targetId ||
      movedId === targetId
    ) {
      return;
    }

    const fromIndex =
      this.panelOrder.indexOf(
        movedId
      );

    const toIndex =
      this.panelOrder.indexOf(
        targetId
      );

    if (
      fromIndex < 0 ||
      toIndex < 0
    ) {
      return;
    }

    moveItemInArray(
      this.panelOrder,
      fromIndex,
      toIndex
    );
  }

  isFirstVisible(id: DashboardPanelId): boolean {
    return this.visiblePanelOrder[0] === id;
  }

  isLastVisible(id: DashboardPanelId): boolean {
    const list = this.visiblePanelOrder;
    return list[list.length - 1] === id;
  }

  // ---- 任務內容 Dashboard 的 box(基本資訊/目前進度/進度回報時間軸)----
  // 邏輯跟上面的 panels/panelOrder 完全對應,只是換一組獨立的狀態

  get hiddenTaskViewPanels(): TaskViewPanel[] {
    return this.taskViewPanels.filter(
      panel => !panel.visible
    );
  }

  get visibleTaskViewPanelOrder(): TaskViewPanelId[] {
    return this.taskViewPanelOrder.filter(
      id => {
        const panel =
          this.taskViewPanels.find(
            p => p.id === id
          );

        return !!panel?.visible;
      }
    );
  }

  hideTaskViewPanel(id: TaskViewPanelId): void {
    const panel =
      this.taskViewPanels.find(
        p => p.id === id
      );

    if (panel) {
      panel.visible = false;
    }
  }

  restoreTaskViewPanel(id: string): void {
    if (!id) {
      return;
    }

    const panel =
      this.taskViewPanels.find(
        p => p.id === id
      );

    if (panel) {
      panel.visible = true;
    }
  }

  moveTaskViewPanelUp(id: TaskViewPanelId): void {
    const index =
      this.taskViewPanelOrder.indexOf(id);

    if (index <= 0) {
      return;
    }

    moveItemInArray(
      this.taskViewPanelOrder,
      index,
      index - 1
    );
  }

  moveTaskViewPanelDown(id: TaskViewPanelId): void {
    const index =
      this.taskViewPanelOrder.indexOf(id);

    if (
      index < 0 ||
      index >=
        this.taskViewPanelOrder.length - 1
    ) {
      return;
    }

    moveItemInArray(
      this.taskViewPanelOrder,
      index,
      index + 1
    );
  }

  dropTaskViewPanel(
    event: CdkDragDrop<TaskViewPanelId[]>
  ): void {
    const visibleIds =
      this.visibleTaskViewPanelOrder;

    const movedId =
      visibleIds[event.previousIndex];

    const targetId =
      visibleIds[event.currentIndex];

    if (
      !movedId ||
      !targetId ||
      movedId === targetId
    ) {
      return;
    }

    const fromIndex =
      this.taskViewPanelOrder.indexOf(
        movedId
      );

    const toIndex =
      this.taskViewPanelOrder.indexOf(
        targetId
      );

    if (
      fromIndex < 0 ||
      toIndex < 0
    ) {
      return;
    }

    moveItemInArray(
      this.taskViewPanelOrder,
      fromIndex,
      toIndex
    );
  }

  isFirstVisibleTaskView(id: TaskViewPanelId): boolean {
    return this.visibleTaskViewPanelOrder[0] === id;
  }

  isLastVisibleTaskView(id: TaskViewPanelId): boolean {
    const list = this.visibleTaskViewPanelOrder;
    return list[list.length - 1] === id;
  }
}