import { LogicalConditionInterface } from "./logical-condition-interface";

export enum LogicalOperator{
    AND = 1,
    OR = 2,
    NOT = 3
}


export class LogicalConditionComposite implements LogicalConditionInterface {
    public parent:LogicalConditionInterface | null;
    public operator:LogicalOperator;
    public childs:LogicalConditionInterface[] = [];

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

    public toString():string {
        let result = '';
        if(this.operator === LogicalOperator.NOT){
            result += 'not(';
        } else {
            result += '(';
        }
        let i = 0;
        for(let child of this.childs){
            if(i>0){
                if(this.operator !== LogicalOperator.NOT){
                    result+=` ${this.getLogicalOperator()} `;
                }
            }
            result+=child.toString();
            i++;
        }
        result+=')';
        return result;
    }
   
    public getRoot():LogicalConditionInterface
    {
        if(this.parent == null) {return this;}
        return this.parent.getRoot();
    }

    public static ConvertStringToOperator(value:string):LogicalOperator | null
    {
        value = (value ?? '').trim().toLowerCase();
        switch(value)
        {
            case 'and':{
                return LogicalOperator.AND;
            }
            case 'or':{
                return LogicalOperator.OR;
            }
            case 'not':{
                return LogicalOperator.NOT;
            }
            default:{
                break
            }
        }
        return null;
    }

    private getLogicalOperator():string{
        const operator = this.operator;
        switch(operator){
            case LogicalOperator.AND:{
                return 'and';
            }
            case LogicalOperator.OR:{
                return 'or';
            }
            case LogicalOperator.NOT:{
                return 'not';
            }
            default:{
                return '(undefined logical operator!)';
            }
        }
   }
}