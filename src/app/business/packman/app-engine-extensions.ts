import { Convert } from '../../services/convert';
import { ObjectsMap } from '../models/object-move/objects-map'
import { JsonObjectUtils } from "../../services/json-object-utils";
import { GuiManagerExtensions } from './gui-manager-extensions';
import { MapObject } from '../models/object-move/map-object';
import { ObjectPosition } from "../models/object-move/object-position";
import { Constants } from "../constants";

export class AppEngineExtensions{
    
    public static initializeObjectsMapFromMap(jsonObject:any): ObjectsMap{
        const objectsMap = new ObjectsMap([]);
        const emptyBlocks = JsonObjectUtils.addObjects('empty-block', jsonObject, []);
        const mapObject = JsonObjectUtils.getObject('map', jsonObject);
        const sizeX = Convert.toNumber(mapObject.size.toString().split(',')[0]);
        const sizeY = Convert.toNumber(mapObject.size.toString().split(',')[1]);
        for(var x = 1; x <= sizeX; x++){
            for(var y = 1; y <= sizeY; y++){
                if(GuiManagerExtensions.shouldCreateFilledBlock(emptyBlocks, x, y)){
                    let mapOpbject = new MapObject(new ObjectPosition(x, y), Constants.Gui.Objects.FilledBlock.Name);
                    objectsMap.objects.push(mapOpbject);
                } else {
                    let mapOpbject = new MapObject(new ObjectPosition(x, y), Constants.Gui.Objects.EmptyBlock.Name);
                    objectsMap.objects.push(mapOpbject);
                }
            }
        }
        return objectsMap;
   }

   public static addMapObjectToObjectMapFromJsonObjects(objectMap:ObjectsMap, jsonObject:any){
        this.tryCreateMovingObjectFromJsonObject(jsonObject, objectMap);

        if(!jsonObject.childs) { return;}
        for(let child of jsonObject.childs){
            this.addMapObjectToObjectMapFromJsonObjects(objectMap, child);
        }
    }

    public static startBehaviorObjects(jsonObject:any){


        if(!jsonObject.childs) { return;}
        for(let child of jsonObject.childs){
            this.startBehaviorObjects(child);
        }
    }

    private static tryCreateMovingObjectFromJsonObject(jsonObject:any, objectMap:ObjectsMap): boolean{
        if(jsonObject.name === Constants.Gui.BehaviorObjects.MovingObject.Name){
            const x = Convert.toNumber(jsonObject.position.toString().split(',')[0]);
            const y = Convert.toNumber(jsonObject.position.toString().split(',')[1]);
            let mapOpbject = new MapObject(new ObjectPosition(x, y), Constants.Gui.BehaviorObjects.MovingObject.ObjectType);
            objectMap.objects.push(mapOpbject);
            return true;
        }
        return false;
    }
}