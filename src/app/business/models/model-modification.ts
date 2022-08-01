export class ModelModification {
    public modelModificationKey:number;
    public payload:any;

    public constructor(modelModificationKey:number, payload:any){
        this.modelModificationKey = modelModificationKey;
        this.payload = payload;
    }
}