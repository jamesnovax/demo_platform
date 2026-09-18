import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

interface ProjectTask {
  id: number;
  title: string;
  assignee: string;
  status: TaskStatus;
  startDay: number;
  endDay: number;
}

interface DiscussionNote {
  id: number;
  author: string;
  snippet: string;
  time: string;
}

interface ProjectDetailData {
  timelineLength: number;
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

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    FormsModule,
    DragDropModule
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

      tasks: [
        {
          id: 1,
          title: '首頁視覺設計',
          assignee: '王冠廷',
          status: '已完成',
          startDay: 1,
          endDay: 5
        },
        {
          id: 2,
          title: '前端切版',
          assignee: '林柏宇',
          status: '進行中',
          startDay: 4,
          endDay: 12
        },
        {
          id: 3,
          title: 'API 串接',
          assignee: '黃芷晴',
          status: '進行中',
          startDay: 8,
          endDay: 16
        },
        {
          id: 4,
          title: '驗收測試',
          assignee: '陳雨潔',
          status: '未開始',
          startDay: 16,
          endDay: 20
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

      tasks: [
        {
          id: 1,
          title: '需求訪談',
          assignee: '陳雨潔',
          status: '已完成',
          startDay: 1,
          endDay: 4
        },
        {
          id: 2,
          title: 'UI 原型設計',
          assignee: '王冠廷',
          status: '已完成',
          startDay: 3,
          endDay: 10
        },
        {
          id: 3,
          title: 'App 前端開發',
          assignee: '林柏宇',
          status: '延遲',
          startDay: 9,
          endDay: 22
        },
        {
          id: 4,
          title: '後端 API 開發',
          assignee: '黃芷晴',
          status: '進行中',
          startDay: 9,
          endDay: 20
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

      tasks: [
        {
          id: 1,
          title: '盤點現有工具',
          assignee: '黃芷晴',
          status: '已完成',
          startDay: 1,
          endDay: 4
        },
        {
          id: 2,
          title: '整合方案設計',
          assignee: '陳雨潔',
          status: '進行中',
          startDay: 4,
          endDay: 10
        },
        {
          id: 3,
          title: '試點導入',
          assignee: '林柏宇',
          status: '未開始',
          startDay: 10,
          endDay: 16
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

  select(id: number): void {
    this.selectedId = id;

    this.router.navigate([
      '/projects',
      id
    ]);
  }

  get selectedProject(): ProjectItem {
    return this.projects.find(
      p => p.id === this.selectedId
    )!;
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

  viewTask(task: ProjectTask): void {
    console.log('查看任務', task);
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
        ...this.formTask
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

  isPanelVisible(panelId: string): boolean {
    const panel = this.panels.find(p => p.id === panelId);
    return panel?.visible ?? false;
  }
  get timelineDays(): number[] {
    return Array.from(
      { length: this.selectedDetail.timelineLength },
        (_, index) => index + 1
    );
  }
}