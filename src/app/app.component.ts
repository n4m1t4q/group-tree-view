import { Component, VERSION } from '@angular/core';

import { Group, GroupTree } from './model/group';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  selectedGroup: Group;

  groupTree: GroupTree = [{
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

  onGroupSelected(group: Group) {
    this.selectedGroup = group;
  }
}
