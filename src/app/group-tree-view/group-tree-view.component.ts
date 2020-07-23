import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface Group {
  name: string;
  id: string,
  visible: boolean;
  children: Group[];
}

@Component({
  selector: 'app-group-tree-view',
  templateUrl: './group-tree-view.component.html',
  styleUrls: ['./group-tree-view.component.scss']
})
export class GroupTreeViewComponent implements OnInit, AfterViewInit {
  @ViewChild('filterInput') input: ElementRef;
  // Input: groupTree
  // Output: group
  private subscription: Subscription;
  overview: Group[];
  groupTree: Group[];
  filtered: boolean;
  selectedGroupId: string;

  constructor() { }

  ngOnInit() {
    this.groupTree = [{
      name: '代表取締役',
      id: 'ceo',
      visible: true,
      children: [
        {
          name: '営業課',
          id: 'sales',
          visible: true,
          children: [
            {
              name: '営業1課',
              id: 'sales1',
              visible: true,
              children: [],
            },
            {
              name: '営業2課',
              id: 'sales2',
              visible: true,
              children: [],
            }
          ],
        },
        {
          name: '経理部',
          id: 'accounting',
          visible: true,
          children: [],
        }
      ]
    }];
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

  onGroupNameClick(group: Group) {
    this.selectedGroupId = group.id;
  }

  private filtering(value: string): void {
    if (value === '') {
      this.ngOnInit();
      this.filtered = false;
      return;
    }

    this.filtered = true;
    this.groupTree = [...this.groupTree].map((group) => 
      this.dfs(group, value)
    )
  }

  private dfs(group: Group, value: string): Group {
    const children = [...group.children].map((group) =>
      this.dfs(group, value)
    );
    const childrenVisibles = [...children]
      .reduce((sum: number, child: Group) => sum + (child.visible ? 1 : 0), 0);

    return {
      ...group,
      children: [...children],
      visible: group.name.includes(value) || !!childrenVisibles
    }
  }

  trackById(index: number, value: Group) {
    return value ? value.id : null;
  }

}