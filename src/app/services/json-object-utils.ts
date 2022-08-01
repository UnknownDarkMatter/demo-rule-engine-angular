import { Constants } from"../business/constants";

export class JsonObjectUtils {

    public static getObject(name:string, jsonObject:any):any{
        if(jsonObject.name === name){
            return jsonObject;
        }
        if(!jsonObject.childs) { return null;}
        for(let child of jsonObject.childs){
            let childObject = this.getObject(name, child);
            if(childObject){
                return childObject;
            }
        }
        return null;
    }

    public static addObjects(name:string, jsonObject:any, result:any[]){
        if(jsonObject.name === name){
            result.push(jsonObject);
        }
        if(!jsonObject.childs) { return result;}
        for(let child of jsonObject.childs){
            this.addObjects(name, child, result);
        }
        return result;
    }

    public static isRoot(jsonObject:any):boolean
    {
        let parent = jsonObject[Constants.JsonObject.Parent.Name];
        return parent == null;
    }
}

