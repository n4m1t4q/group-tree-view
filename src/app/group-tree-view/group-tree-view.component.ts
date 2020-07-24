import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Group, GroupDisplay, GroupTree } from '../model/group';

@Component({
  selector: 'app-group-tree-view',
  templateUrl: './group-tree-view.component.html',
  styleUrls: ['./group-tree-view.component.scss']
})
export class GroupTreeViewComponent implements OnInit, AfterViewInit {
  @Input() groupTree: GroupTree;
  private initialGroupTree: GroupTree;

  @ViewChild('filterInput') input: ElementRef;
  private subscription: Subscription;
  @Output() selected = new EventEmitter<Group>();
  filtered: boolean;
  
  selectedGroupId: string;

  constructor() { }

  ngOnInit() {
    this.initialGroupTree = this.groupTree;
    this.filtered = false;
  }

  ngAfterViewInit() {
    this.subscription = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map((event) => event.target.value),
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(
        value => {
          this.filtering(value);
        }
      );
  }

  onGroupNameClick(group: GroupDisplay) {
    this.selectedGroupId = group.id;
    this.selected.emit({ id: group.id, name: group.name });
  }

  private filtering(value: string): void {
    if (value === '') {
      this.groupTree = [...this.initialGroupTree];
      this.filtered = false;
      return;
    }

    this.groupTree = [...this.groupTree].map((group) => 
      this.setVisible(group, value)
    )
    this.filtered = true;
  }

  private setVisible(group: GroupDisplay, value: string): GroupDisplay {
    const children = [...group.children].map((group) =>
      this.setVisible(group, value)
    );

    return {
      ...group,
      children: [...children],
      visible: group.name.includes(value) || !![...children].find((group) => group.visible)
    }
  }

  trackById(_, value: GroupDisplay) {
    return value ? value.id : null;
  }

}