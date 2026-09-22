import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-projectlist',
  standalone: true,
  templateUrl: './projectlist.html',
  styleUrl: './projectlist.scss'
})
export class ProjectList {

  @Input() projects: any[] = [];

  @Input() selectedId: string | number | null = null;

  @Output() projectSelected = new EventEmitter<string | number>();

  select(id: string | number): void {
    this.projectSelected.emit(id);
  }
}