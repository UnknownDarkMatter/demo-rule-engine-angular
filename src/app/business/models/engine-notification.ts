export class EngineNotification {
    notificationKey:number;
    emitterFriendlyName:string;
    notificationFriendlyName:string;
    payload:any;

    constructor(notificationKey:number, payload:any, emitterFriendlyName:string, notificationFriendlyName:string){
        this.notificationKey = notificationKey;
        this.emitterFriendlyName = emitterFriendlyName;
        this.payload = payload;
        this.notificationFriendlyName = notificationFriendlyName;
    }
}