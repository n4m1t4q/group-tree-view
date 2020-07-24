export interface Group {
  name: string;
  id: string,
}

export interface GroupDisplay extends Group {
  visible: boolean;
  children: GroupDisplay[];
}

export type GroupTree = GroupDisplay[];