import { Component, Input, OnInit } from '@angular/core';
import { Constants } from 'src/app/business/constants';
import { GuiBlock } from 'src/app/business/models/gui-block';

@Component({
  selector: 'app-gui-block',
  templateUrl: './gui-block.component.html',
  styleUrls: ['./gui-block.component.scss']
})
export class GuiBlockComponent implements OnInit {

  @Input() public GuiBlock:GuiBlock;
  public Size:number = 38;
  public Space:number = 1;

  constructor() { }

  ngOnInit(): void {
  }

  public getX():string{
    //return `calc(50% - ${this.Size * (this.GuiBlock.X + this.Space)}px)`;
    return `${this.Size * (this.GuiBlock.X + this.Space)}px`;
  }

  public getY():string{
    //return `calc(50% - ${this.Size * (this.GuiBlock.Y + this.Space)}px)`;
    return `${this.Size * (this.GuiBlock.Y + this.Space)}px`;
  }
  public getClassName():string{
    switch(this.GuiBlock.Type){
      case Constants.Gui.Objects.FilledBlock.Name:{
        return 'filled-block';
      }
      case Constants.Gui.Objects.EmptyBlock.Name:{
        return 'empty-block';
      }
      case Constants.Gui.BehaviorObjects.MovingObject.ObjectType:{
        return 'packman-block';
      }
      case Constants.Gui.BehaviorObjects.RobotObject.ObjectType:{
        return 'robot-block';
      }
      case Constants.Gui.Objects.BlueBullet.Name:{
        return 'blue-bullet-block';
      }
      case Constants.Gui.Objects.RaspBerry.Name:{
        return 'raspberry-block';
      }
      default:{
          break;
      }
    }
  }
}
