export interface RuleType {
  key: React.Key;
  host: string;
  target: string;
  tag: string;
  tagMap?: Map<any, any>;
  sort:number;
  remark:string;
  checked: boolean;
}