export interface LogicalConditionInterface {
    parent:LogicalConditionInterface | null;
    isTrue(object:any):boolean;
}