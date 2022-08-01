import { ModelModification } from './model-modification';
import { ObjectsMap } from './object-move/objects-map';

export class ModelModificationsCollection {
    public modelModifications:ModelModification[];
    public objectsMap:ObjectsMap;

    public constructor(modelModifications:ModelModification[], objectsMap:ObjectsMap){
        this.modelModifications = modelModifications;
        this.objectsMap = objectsMap;
    }
}