import { Injectable } from"@angular/core";
import { Subject } from"rxjs";
import { AppEngine } from"./app-engine";
import { EventGeneric } from './models/event-generic';
import { EventKeyPress } from './models/event-keypress'
import { JsonObjectUtils } from '../services/json-object-utils'
import { Convert } from '../services/convert'
import { GuiAction } from '../business/models/gui-action';
import { Constants } from '../business/constants';
import { ObjectMoving } from './models/object-move/object-moving';
import  { GuiManagerExtensions } from './packman/gui-manager-extensions';
import { ObjectPosition } from "./models/object-move/object-position";

@Injectable()
export class GuiManager {

	public eventSubject:Subject<EventGeneric> = new Subject<EventGeneric>();
	public guiUpdateSubject:Subject<GuiAction> = new Subject<GuiAction>();

    constructor(private appEngine:AppEngine){
        this.appEngine.guiManager = this;
        this.eventSubject.subscribe(event => {
            this.onEvent(event);
        });
    }

    public buildGui(jsonObject:any){
        const emptyBlocks = JsonObjectUtils.addObjects('empty-block', jsonObject, []);
        const mapObject = JsonObjectUtils.getObject('map', jsonObject);
        const sizeX = Convert.toNumber(mapObject.size.toString().split(',')[0]);
        const sizeY = Convert.toNumber(mapObject.size.toString().split(',')[1]);
        for(var x = 1; x <= sizeX; x++){
            for(var y = 1; y <= sizeY; y++){
                if(GuiManagerExtensions.shouldCreateFilledBlock(emptyBlocks, x, y)){
                    this.guiUpdateSubject.next({'action':Constants.Gui.Actions.Create, 'object':Constants.Gui.Objects.FilledBlock.Name, 'position':`${x},${y}`});
                } else {
                    this.guiUpdateSubject.next({'action':Constants.Gui.Actions.Create, 'object':Constants.Gui.Objects.EmptyBlock.Name, 'position':`${x},${y}`});
                }
            }
        }
        GuiManagerExtensions.initProgrammaticallyAddedObjects(jsonObject, this.guiUpdateSubject);
    }

    public removeObject(objectPosition:ObjectPosition, objectType:string){
        this.guiUpdateSubject.next({
            'action':Constants.Gui.Actions.Delete, 
            'object':objectType, 
            'position':`${objectPosition.x},${objectPosition.y}`});
    }

    public moveObject(objectMoving:ObjectMoving, objectType:string){
        this.guiUpdateSubject.next({
            'action':Constants.Gui.Actions.Delete, 
            'object':objectType, 
            'position':`${objectMoving.from.x},${objectMoving.from.y}`});
        
        this.guiUpdateSubject.next({
                'action':Constants.Gui.Actions.Create, 
                'object':objectType, 
                'position':`${objectMoving.to.x},${objectMoving.to.y}`});
    }

    
    private onEvent(event:EventGeneric){
        if(event instanceof EventKeyPress){
            this.appEngine.guiEventKeyPressSubject.next(event);
        }
    }
}

