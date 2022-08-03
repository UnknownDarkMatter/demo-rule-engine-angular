import { Constants } from "../constants";
import { LogicalConditionInterface } from "./logical-condition-interface";

export enum ComparisonOperator{
    Equal = 1,
    SuperiorStrict = 2,
    SuperiorOrEqual = 3,
    LowerStrict = 4,
    LowerOrEqual = 5,
}

export class LogicalConditionObjectAttribute implements LogicalConditionInterface {
    public parent:LogicalConditionInterface | null;
    //[object, attributeName, valueExpected, ComparisonOperator]
    public objectAttributesValuesExpected:any[] = [];

    constructor(objectAttributesValuesExpected:any[], parent:LogicalConditionInterface | null){
        this.objectAttributesValuesExpected = objectAttributesValuesExpected;
        this.parent = parent;
    }

    public isTrue(object:any):boolean{
        if(Constants.todo && this.objectAttributesValuesExpected[0] != object){
            return false;
        }
        const attributeOfGivenObject = object[this.objectAttributesValuesExpected[1]];
        const attributeExpectedOfObject = this.objectAttributesValuesExpected[2];
        const comparisonOperator = this.objectAttributesValuesExpected[3] as unknown as ComparisonOperator;
        if(this.compareValues(attributeOfGivenObject, attributeExpectedOfObject, comparisonOperator)){
            return true;
        }
        return false;
    }

    public toString():string {
        return `${this.getExpectedObjectName()}.${this.getExpectedAttributeName()}${this.getExpectedComparisonOperator()}${this.getExpectedAttributeValue()}`;
    }

    public getRoot():LogicalConditionInterface
    {
        if(this.parent == null) {return this;}
        return this.parent.getRoot();
    }

    public static ConvertStringToComparison(value:string):ComparisonOperator | null
    {
        switch(value)
        {
            case '=':{
                return ComparisonOperator.Equal;
            }
            case '<':{
                return ComparisonOperator.LowerStrict;
            }
            case '<=':{
                return ComparisonOperator.LowerOrEqual;
            }
            case '>':{
                return ComparisonOperator.SuperiorStrict;
            }
            case '>=':{
                return ComparisonOperator.SuperiorOrEqual;
            }
            default:{
                break
            }
        }
        return null;
    }

    private getExpectedObjectName():string{
        return this.objectAttributesValuesExpected[0].name;
    }

    private getExpectedAttributeName():string{
        return this.objectAttributesValuesExpected[1];
    }

    private getExpectedAttributeValue():string{
        return this.objectAttributesValuesExpected[2];
    }

    private getExpectedComparisonOperator():string{
        const comparisonOperator = this.objectAttributesValuesExpected[3];
        switch(comparisonOperator){
            case ComparisonOperator.Equal:{
                return '=';
            }
            case ComparisonOperator.SuperiorStrict:{
                return '>';
            }
            case ComparisonOperator.SuperiorOrEqual:{
                return '>=';
            }
            case ComparisonOperator.LowerStrict:{
                return '<';
            }
            case ComparisonOperator.LowerOrEqual:{
                return '<=';
            }
            default:{
                return '(undefined comparison operator!)';
            }
        }
   }

    private compareValues(attributeOfGivenObject:any, attributeExpectedOfObject:any, 
        comparisonOperator:ComparisonOperator):boolean
    {
        switch(comparisonOperator){
            case ComparisonOperator.Equal:{
                if(attributeOfGivenObject === attributeExpectedOfObject){
                    return true;
                }
                break;
            }
            case ComparisonOperator.SuperiorStrict:{
                if(attributeOfGivenObject > attributeExpectedOfObject){
                    return true;
                }
                break;
            }
            case ComparisonOperator.SuperiorOrEqual:{
                if(attributeOfGivenObject >= attributeExpectedOfObject){
                    return true;
                }
                break;
            }
            case ComparisonOperator.LowerStrict:{
                if(attributeOfGivenObject < attributeExpectedOfObject){
                    return true;
                }
                break;
            }
            case ComparisonOperator.LowerOrEqual:{
                if(attributeOfGivenObject <= attributeExpectedOfObject){
                    return true;
                }
                break;
            }
            default:{
                break;
            }
        }
        return false;
    }
}