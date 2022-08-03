
import { Constants } from"../constants";
import { LogicalConditionInterface } from "../models/logical-condition-interface";
import { LogicalConditionComposite, LogicalOperator } from "../models/logical-condition-composite";
import { LogicalConditionObjectAttribute, ComparisonOperator } from "../models/logical-condition-object-attribute";
import { JsonObjectUtils } from "src/app/services/json-object-utils";


class ParsingResult {
    buffer:string;
    condition:LogicalConditionInterface|null;
    isFirstCompositeCondition:boolean;
}

class Word {
    value:string = '';
    lengthNotTrimed:number = 0;
}

export class LogicalConditionFabric {

    public static CreateLogicalCondition(expression:string, parentJsonObject:any):LogicalConditionInterface|null{

        if(!expression) {return null;}

        let parsingResult = new ParsingResult();
        parsingResult.condition = null;
        parsingResult.buffer = expression;
        this.addNextCondition(parsingResult, null, parentJsonObject);
        if(!parsingResult.condition){
            return null; 
        }
        return parsingResult.condition.getRoot();      
    }

    private static addNextCondition(parsingResult:ParsingResult, 
        parent:LogicalConditionInterface|null, parentJsonObject:any):LogicalConditionInterface|null{
        console.log(`LogicalConditionFabric.addNextCondition : BEGIN buffer=${parsingResult.buffer}`);
        const nextCar = this.getNextChar(parsingResult);
        if(nextCar === '') { 
            return null;
        }
        if(!this.tryInstanciateNextCondition(parsingResult, nextCar, parent)){
            return null;
        }
        
        if(parsingResult.condition instanceof LogicalConditionComposite){
            let compositeCondition = parsingResult.condition as LogicalConditionComposite;
            while(this.tryFillNextCompositeCondition(parsingResult, compositeCondition, parentJsonObject)){}
            return compositeCondition;
        } else {
            this.tryFillNextAttributeCondition(parsingResult, parent, parentJsonObject);
            return parsingResult.condition;
        }
    }

    private static tryInstanciateNextCondition(parsingResult:ParsingResult, nextCar:string, 
            parent:LogicalConditionInterface|null):boolean{
        let nextCondition:LogicalConditionInterface|null = null;
        console.log(`LogicalConditionFabric.tryInstanciateNextCondition : BEGIN nextCar=${nextCar}, buffer=${parsingResult.buffer}`);
        if(nextCar === ')') { return false;}
        let isNextConditionComposite = nextCar === '(';
        if(nextCar === 'and' || nextCar ==='or'){
            isNextConditionComposite = this.isCompositeConditionAfterLogicalOperator(parsingResult, nextCar);
        }
        if(isNextConditionComposite){
            nextCondition = new LogicalConditionComposite(LogicalOperator.AND, parsingResult.condition);
            parsingResult.isFirstCompositeCondition = true;
            this.removeNextChar(parsingResult, nextCar);
        } else {
            nextCondition = new LogicalConditionObjectAttribute([], parent);
        }
        parsingResult.condition = nextCondition;
        console.log(`LogicalConditionFabric.tryInstanciateNextCondition : END buffer=${parsingResult.buffer}, isNextConditionComposite=${isNextConditionComposite}`);
        return true;
    }

    private static tryFillNextCompositeCondition(parsingResult:ParsingResult, 
        compositeCondition:LogicalConditionComposite|null, parentJsonObject):boolean{
        if(!parsingResult.isFirstCompositeCondition){
            const logicalOperator = this.getNextLogicalOperator(parsingResult);
            if(logicalOperator){
                compositeCondition.operator = logicalOperator;
                this.removeNextLogicalOperator(parsingResult, logicalOperator);
            }
        }
        parsingResult.isFirstCompositeCondition = false;

        const nextCondition = this.addNextCondition(parsingResult, compositeCondition, parentJsonObject);
        if(!nextCondition){ return false;}
        compositeCondition.childs.push(nextCondition);
        return true;
    }

    private static tryFillNextAttributeCondition(parsingResult:ParsingResult, 
        parent:LogicalConditionInterface|null, parentJsonObject):boolean{
        let bufferInitial = parsingResult.buffer;
        let buffer = parsingResult.buffer;

        const objectIdWord = this.getWordBeforeChar(buffer, ['.']);
        if(objectIdWord.value.length === 0) { throw new Error(`Invalid attribute:${Constants.Rules.DynamicRefId}, objectIdWord is empty`);}
        buffer = buffer.substring(objectIdWord.lengthNotTrimed);

        const attributeNameWord = this.getWordBeforeChar(buffer, [' ','=','<','>']);
        if(attributeNameWord.value.length < 1) { throw new Error(`Invalid attribute:${Constants.Rules.DynamicRefId}, attributeNameWord is empty`);}
        attributeNameWord.value = attributeNameWord.value.substring(1);
        buffer = buffer.substring(attributeNameWord.lengthNotTrimed);

        let spaceWord = this.getWordContainingChars(buffer, [' ']);
        buffer = buffer.substring(spaceWord.lengthNotTrimed);

        const comparisonOperatorWord = this.getWordContainingChars(buffer, ['=','<','>']);
        buffer = buffer.substring(comparisonOperatorWord.lengthNotTrimed);
        if(comparisonOperatorWord.value.length === 0) { throw new Error(`Invalid attribute:${Constants.Rules.DynamicRefId}, comparisonOperatorWord is empty`);}

        spaceWord = this.getWordContainingChars(buffer, [' ']);
        buffer = buffer.substring(spaceWord.lengthNotTrimed);

        const attributeValueWord = this.getWordBeforeChar(buffer, [' ',')']);
        buffer = buffer.substring(attributeValueWord.lengthNotTrimed);
        if(attributeValueWord.value.length === 0) { throw new Error(`Invalid attribute:${Constants.Rules.DynamicRefId}, attributeValueWord is empty`);}

        const objectHavingAttribute = JsonObjectUtils.getObjectByAttribute(Constants.Rules.DynamicRefId, objectIdWord.value, parentJsonObject);
        let condition = parsingResult.condition as LogicalConditionObjectAttribute;
        condition.objectAttributesValuesExpected.push(objectHavingAttribute);
        condition.objectAttributesValuesExpected.push(attributeNameWord.value);
        condition.objectAttributesValuesExpected.push(attributeValueWord.value);
        let comparisonOperator = LogicalConditionObjectAttribute.ConvertStringToComparison(comparisonOperatorWord.value);
        condition.objectAttributesValuesExpected.push(comparisonOperator);

        parsingResult.buffer = parsingResult.buffer.substring(bufferInitial.length - buffer.length);

        console.log(`LogicalConditionFabric.tryFillNextAttributeCondition : attribute=${objectHavingAttribute.name}.${attributeNameWord.value}${comparisonOperatorWord.value}${attributeValueWord.value}`);
        return true;
    }


    private static getNextLogicalOperator(parsingResult:ParsingResult):LogicalOperator{
        let bufferInitial = parsingResult.buffer;
        let buffer = parsingResult.buffer;

        const spaceWord = this.getWordContainingChars(buffer, [' ']);
        buffer = buffer.substring(spaceWord.lengthNotTrimed);

        const operatorWord = this.getWordBeforeChar(buffer, [' ']);
        buffer = buffer.substring(operatorWord.lengthNotTrimed);

        let operator = LogicalConditionComposite.ConvertStringToOperator(operatorWord.value);

        return operator;
    }

    private static removeNextLogicalOperator(parsingResult:ParsingResult, 
        logicalOperator:LogicalOperator):ParsingResult{

        let bufferInitial = parsingResult.buffer;
        let buffer = parsingResult.buffer;
    
        const spaceWord = this.getWordContainingChars(buffer, [' ']);
        buffer = buffer.substring(spaceWord.lengthNotTrimed);
    
        const operatorWord = this.getWordBeforeChar(buffer, [' ']);
        buffer = buffer.substring(operatorWord.lengthNotTrimed);

        parsingResult.buffer = parsingResult.buffer.substring(bufferInitial.length - buffer.length);
          
        return parsingResult;
    }

    private static isCompositeConditionAfterLogicalOperator(parsingResult:ParsingResult, nextCar:string):boolean{
        let buffer = parsingResult.buffer;

        let spaceWord = this.getWordContainingChars(buffer, [' ']);
        buffer = buffer.substring(spaceWord.lengthNotTrimed);

        const operatorWord = this.getWordBeforeChar(buffer, [' ']);
        buffer = buffer.substring(operatorWord.lengthNotTrimed);

        spaceWord = this.getWordContainingChars(buffer, [' ']);
        buffer = buffer.substring(spaceWord.lengthNotTrimed);

        if(buffer.length > 0 && buffer.substring(0, 1) === '('){
            return true;
        }

        return false;
    }

    private static getNextChar(parsingResult:ParsingResult):string{
        //todo: not(
        let buffer = parsingResult.buffer;

        const operatorWord = this.getWordBeforeChar(buffer, [' ']);
        if(operatorWord.value.length>0){
            if(operatorWord.value.toLowerCase() == 'and' || operatorWord.value.toLowerCase() == 'or'){
                return operatorWord.value.toLowerCase();
            }
            return operatorWord.value.substring(0, 1);
        }

        return '';
    }

    private static removeNextChar(parsingResult:ParsingResult, nextCar:string):ParsingResult{
        //todo:and, or, not and space

        console.log(`LogicalConditionFabric.removeNextChar : BEGIN, buffer=${parsingResult.buffer}`);
        let bufferInitial = parsingResult.buffer;
        let buffer = parsingResult.buffer;

        let spaceWord = this.getWordContainingChars(buffer, [' ']);
        buffer = buffer.substring(spaceWord.lengthNotTrimed);

        let parenthesisWord = this.getWordContainingChars(buffer, ['(']);
        buffer = buffer.substring(parenthesisWord.lengthNotTrimed);

        spaceWord = this.getWordContainingChars(buffer, [' ']);
        buffer = buffer.substring(spaceWord.lengthNotTrimed);

        const operatorWord = this.getWordBeforeChar(buffer, [' ']);
        if(operatorWord.value.length>0 && (operatorWord.value.toLowerCase() == 'and' 
        || operatorWord.value.toLowerCase() == 'or')){
            buffer = buffer.substring(operatorWord.lengthNotTrimed);
        }
        parsingResult.buffer = parsingResult.buffer.substring(bufferInitial.length - buffer.length);

        console.log(`LogicalConditionFabric.removeNextChar : END, buffer=${parsingResult.buffer}`);
        return parsingResult;
    }


    private static getWordBeforeChar(text:string, char:string[]):Word{
        let word = new Word();
        let charTmp:string;

        //ignore spaces before word
        while(text.length > 0){
            let charTmp = text.substring(0, 1);
            if(charTmp !== ' '){
                break;
            } else {
                word.lengthNotTrimed+=1;
            }
            text = text.substring(1);
        }
        
        //take word until given stop chars or space
        while(text.length > 0){
            let charTmp = text.substring(0, 1);
            if(charTmp === ' ' || char.filter(m => m === charTmp).length > 0){
                break;
            } else {
                word.lengthNotTrimed+=1;
                word.value += charTmp;
            }
            text = text.substring(1);
        }
        return word;
    }

    private static getWordContainingChars(text:string, chars:string[]):Word{
        const word = new Word();

        while(text.length > 0){
            let charTmp = text.substring(0, 1);
            if(chars.filter(m => m === charTmp).length === 0){
                break;
            } else {
                word.lengthNotTrimed+=1;
                word.value += charTmp;
            }
            text = text.substring(1);
        }
        return word;
    }
}

