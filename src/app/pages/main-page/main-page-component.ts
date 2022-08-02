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
        if(guiAction.action === Constants.Gui.Actions.GameOver){
            this.showGameOver();
        }
        if(guiAction.action === Constants.Gui.Actions.Create && guiAction.object === Constants.Gui.Objects.FilledBlock.Name){
            this.createObject(guiAction.position, Constants.Gui.Objects.FilledBlock.Name);
        }
        if(guiAction.action === Constants.Gui.Actions.Create && guiAction.object === Constants.Gui.Objects.EmptyBlock.Name){
            this.createObject(guiAction.position, Constants.Gui.Objects.EmptyBlock.Name);
        }
        
        if(guiAction.action === Constants.Gui.Actions.Create && guiAction.object === Constants.Gui.BehaviorObjects.MovingObject.ObjectType){
            this.createObject(guiAction.position, Constants.Gui.BehaviorObjects.MovingObject.ObjectType);
        }
        if(guiAction.action === Constants.Gui.Actions.Delete && guiAction.object === Constants.Gui.BehaviorObjects.MovingObject.ObjectType){
            this.deleteObject(guiAction.position, Constants.Gui.BehaviorObjects.MovingObject.ObjectType);
        }
        
        if(guiAction.action === Constants.Gui.Actions.Create && guiAction.object === Constants.Gui.BehaviorObjects.RobotObject.ObjectType){
            this.createObject(guiAction.position, Constants.Gui.BehaviorObjects.RobotObject.ObjectType);
        }
        if(guiAction.action === Constants.Gui.Actions.Delete && guiAction.object === Constants.Gui.BehaviorObjects.RobotObject.ObjectType){
            this.deleteObject(guiAction.position, Constants.Gui.BehaviorObjects.RobotObject.ObjectType);
        }
          
        if(guiAction.action === Constants.Gui.Actions.Create && guiAction.object === Constants.Gui.Objects.BlueBullet.Name){
            this.createObject(guiAction.position, Constants.Gui.Objects.BlueBullet.Name);
        }
        if(guiAction.action === Constants.Gui.Actions.Delete && guiAction.object === Constants.Gui.Objects.BlueBullet.Name){
            this.deleteObject(guiAction.position, Constants.Gui.Objects.BlueBullet.Name);
        }
          
        if(guiAction.action === Constants.Gui.Actions.Create && guiAction.object === Constants.Gui.Objects.RaspBerry.Name){
            this.createObject(guiAction.position, Constants.Gui.Objects.RaspBerry.Name);
        }
        if(guiAction.action === Constants.Gui.Actions.Delete && guiAction.object === Constants.Gui.Objects.RaspBerry.Name){
            this.deleteObject(guiAction.position, Constants.Gui.Objects.RaspBerry.Name);
        }
  }

    private createObject(position:string, objectType:string){
        const x = position.split(',')[0];
        const y = position.split(',')[1];
        this._guiBlocks.push({'X':Convert.toNumber(x), 'Y':Convert.toNumber(y), 'Type':objectType});
        this.GuiBlocks = of(this._guiBlocks);
    }

    private deleteObject(position:string, objectType:string){
        const x = position.split(',')[0];
        const y = position.split(',')[1];
        this._guiBlocks = this._guiBlocks.filter(m => m.Type !== objectType 
            || m.X !== Convert.toNumber(x) ||  m.Y !== Convert.toNumber(y));
        this.GuiBlocks = of(this._guiBlocks);
    }

    private showGameOver(){
        alert('game over');
    }
}   