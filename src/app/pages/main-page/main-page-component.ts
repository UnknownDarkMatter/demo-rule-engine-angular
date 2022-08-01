import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { GuiManager } from '../../business/gui-manager';
import { EventKeyPress, KeyPressKeyCodesEnum } from '../../business/models/event-keypress'
import { GuiAction } from '../../business/models/gui-action';
import { GuiBlock } from '../../business/models/gui-block';
import { Constants } from '../../business/constants'
import { Observable, of } from 'rxjs';
import { Convert } from 'src/app/services/convert';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page-component.html',
    styleUrls: ['./main-page-component.scss']
})
export class MainPageComponent implements AfterViewInit {
    @ViewChild('mainPageDiv') mainPageDiv!: ElementRef;
    public _guiBlocks:GuiBlock[] = [];
    public GuiBlocks:Observable<GuiBlock[]> = of(this._guiBlocks);

    constructor(private guiManager: GuiManager) { }
    
    ngAfterViewInit(): void {
        this.mainPageDiv.nativeElement.focus();

        this.guiManager.guiUpdateSubject.subscribe(guiAction => {
            this.onGuiAction(guiAction);
        });
    }

    onKeyPress(event: KeyboardEvent){
        const keyPressEvent = new EventKeyPress(event.keyCode);
        this.guiManager.eventSubject.next(keyPressEvent);
    }

    onGuiAction(guiAction:GuiAction){
        if(guiAction.action === Constants.Gui.Actions.Create && guiAction.object === Constants.Gui.Objects.FilledBlock.Name){
            this.createFilledBlock(guiAction.position);
        }
        if(guiAction.action === Constants.Gui.Actions.Create && guiAction.object === Constants.Gui.Objects.EmptyBlock.Name){
            this.createEmptyBlock(guiAction.position);
        }
        
        if(guiAction.action === Constants.Gui.Actions.Create && guiAction.object === Constants.Gui.BehaviorObjects.MovingObject.ObjectType){
            this.createMovingObjectBlock(guiAction.position);
        }
        if(guiAction.action === Constants.Gui.Actions.Delete && guiAction.object === Constants.Gui.BehaviorObjects.MovingObject.ObjectType){
            this.deleteMovingObjectBlock(guiAction.position);
        }
        
        if(guiAction.action === Constants.Gui.Actions.Create && guiAction.object === Constants.Gui.BehaviorObjects.RobotObject.ObjectType){
            this.createRobotObjectBlock(guiAction.position);
        }
        if(guiAction.action === Constants.Gui.Actions.Delete && guiAction.object === Constants.Gui.BehaviorObjects.RobotObject.ObjectType){
            this.deleteRobotObjectBlock(guiAction.position);
        }
          
        if(guiAction.action === Constants.Gui.Actions.Create && guiAction.object === Constants.Gui.Objects.BlueBullet.Name){
            this.createBlueBullet(guiAction.position);
        }
        if(guiAction.action === Constants.Gui.Actions.Delete && guiAction.object === Constants.Gui.Objects.BlueBullet.Name){
            this.deleteBlueBullet(guiAction.position);
        }
  }

    private createFilledBlock(position:string){
        const x = position.split(',')[0];
        const y = position.split(',')[1];
        this._guiBlocks.push({'X':Convert.toNumber(x), 'Y':Convert.toNumber(y), 'Type':Constants.Gui.Objects.FilledBlock.Name});
        this.GuiBlocks = of(this._guiBlocks);
    }

    private createEmptyBlock(position:string){
        const x = position.split(',')[0];
        const y = position.split(',')[1];
        this._guiBlocks.push({'X':Convert.toNumber(x), 'Y':Convert.toNumber(y), 'Type':Constants.Gui.Objects.EmptyBlock.Name});
        this.GuiBlocks = of(this._guiBlocks);
    }

    private createMovingObjectBlock(position:string){
        const x = position.split(',')[0];
        const y = position.split(',')[1];
        this._guiBlocks.push({'X':Convert.toNumber(x), 'Y':Convert.toNumber(y), 'Type':Constants.Gui.BehaviorObjects.MovingObject.ObjectType});
        this.GuiBlocks = of(this._guiBlocks);
    }

    private deleteMovingObjectBlock(position:string){
        const x = position.split(',')[0];
        const y = position.split(',')[1];
        this._guiBlocks = this._guiBlocks.filter(m => m.Type !== Constants.Gui.BehaviorObjects.MovingObject.ObjectType 
            || m.X !== Convert.toNumber(x) ||  m.Y !== Convert.toNumber(y));
        this.GuiBlocks = of(this._guiBlocks);
    }

    private createRobotObjectBlock(position:string){
        const x = position.split(',')[0];
        const y = position.split(',')[1];
        this._guiBlocks.push({'X':Convert.toNumber(x), 'Y':Convert.toNumber(y), 'Type':Constants.Gui.BehaviorObjects.RobotObject.ObjectType});
        this.GuiBlocks = of(this._guiBlocks);
    }

    private deleteRobotObjectBlock(position:string){
        const x = position.split(',')[0];
        const y = position.split(',')[1];
        this._guiBlocks = this._guiBlocks.filter(m => m.Type !== Constants.Gui.BehaviorObjects.RobotObject.ObjectType 
            || m.X !== Convert.toNumber(x) ||  m.Y !== Convert.toNumber(y));
        this.GuiBlocks = of(this._guiBlocks);
    }

    private createBlueBullet(position:string){
        const x = position.split(',')[0];
        const y = position.split(',')[1];
        this._guiBlocks.push({'X':Convert.toNumber(x), 'Y':Convert.toNumber(y), 'Type':Constants.Gui.Objects.BlueBullet.Name});
        this.GuiBlocks = of(this._guiBlocks);
    }

    private deleteBlueBullet(position:string){
        const x = position.split(',')[0];
        const y = position.split(',')[1];
        this._guiBlocks = this._guiBlocks.filter(m => m.Type !== Constants.Gui.Objects.BlueBullet.Name 
            || m.X !== Convert.toNumber(x) ||  m.Y !== Convert.toNumber(y));
        this.GuiBlocks = of(this._guiBlocks);
    }

}