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
  private subscription: Subscription;
  groupTree: Group[];

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
  }

  ngAfterViewInit() {
    this.subscription = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map((event) => event.target.value),
        debounceTime(250),
        distinctUntilChanged()
      ).subscribe(
        value => {
          this.filtering(value);
        }
      );
  }

  private filtering(value: string): void {
    if (value === '') {
      this.ngOnInit();
      return;
    }

    this.groupTree = [...this.groupTree].map((group) => 
      this.dfs(group, value)
    )
  }

  private dfs(group: Group, value: string): Group {
    

    return {
      ...group,
    }
  }

  trackById(index: number, value: Group) {
    return value ? value.id : null;
  }

}