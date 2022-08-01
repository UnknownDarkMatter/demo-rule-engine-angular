import { EngineNotification } from"./engine-notification";

export class NotificationResponse {
    public notification:EngineNotification;

    constructor(notification:EngineNotification){
        this.notification = notification;
    }
}