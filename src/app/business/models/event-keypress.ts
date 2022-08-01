import { keyframes } from '@angular/animations';
import { EventGeneric } from './event-generic';

export enum KeyPressKeyCodesEnum {
    Up = 56,
    Down = 50,
    Left = 52,
    Right = 54,
    Space = 32,
    Enter = 13,
  }

export class EventKeyPress implements EventGeneric {
    KeyCode:KeyPressKeyCodesEnum;

    constructor(KeyCode:KeyPressKeyCodesEnum){
      this.KeyCode = KeyCode;
    }
}
