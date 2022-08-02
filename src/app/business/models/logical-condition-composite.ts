import { LogicalConditionInterface } from "./logical-condition-interface";

export enum LogicalOperator{
    AND = 1,
    OR = 2,
    NOT = 3
}


export class LogicalConditionComposite implements LogicalConditionInterface {
    public parent:LogicalConditionInterface | null;
    private operator:LogicalOperator;
    private childs:LogicalConditionInterface[] = [];

    constructor(operator:LogicalOperator, parent:LogicalConditionInterface | null){
        this.operator = operator;
        this.parent = parent;
    }
    
    public isTrue(object:any):boolean{
        let isTrue = true;
        if(this.operator === LogicalOperator.AND && this.childs.length === 0){
            return false;
        }
        for(let child of this.childs){
            let childIsTrue = child.isTrue(object);
            if(this.operator === LogicalOperator.OR && childIsTrue){
                return true;
            }
            if(this.operator === LogicalOperator.AND && !childIsTrue){
                isTrue = false;
                break;
            }
        }
        return isTrue;
    }


}