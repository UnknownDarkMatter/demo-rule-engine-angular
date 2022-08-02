import { Injectable } from"@angular/core";
import { AppEngine } from"./app-engine";
import { GuiManager } from"./gui-manager";
import { GraphProcessorFabric } from"./fabrics/graph-processors-fabric";
import { RulesFabric } from"./fabrics/rules-fabric";
import { HttpClient } from '@angular/common/http';
import { Constants } from "./constants";
import { PackmanService } from "./packman/packman-service";

@Injectable()
export class AppLoader {

    constructor(private appEngine:AppEngine, private guiManager:GuiManager,private packmanService:PackmanService,
        private httpClient:HttpClient){
    }

    public loadApp(){
        this.appEngine.isGuiBuilded = false;
        this.appEngine.jsonObjectRoot = null;
        const configurationUrl = './app/configuration/rules-default.json';
        if(Constants.enableLogs) console.log(`AppLoader: loading the file ${configurationUrl} ...`);
        this.httpClient.get(configurationUrl).subscribe(jsonObject => {
            if(Constants.enableLogs) console.log(`AppLoader: file successfully parsed into json object.`);
            this.appEngine.jsonObjectRoot = jsonObject;
            this.guiManager.buildGui(jsonObject);
            this.addGraphProcessors(jsonObject, null);
            this.appEngine.startGame();
            this.appEngine.isGuiBuilded = true;
        });
    }

    private addGraphProcessors (jsonObject:any, parentJsonObject:any){
        GraphProcessorFabric.TryCreateProcessorBehaviorMovingObject(jsonObject, parentJsonObject, this.appEngine);
        GraphProcessorFabric.TryCreateProcessorBehaviorRobotObject(jsonObject, parentJsonObject, this.appEngine);
        RulesFabric.TryCreateProcessorRuleMovingObject(jsonObject, parentJsonObject, this.appEngine);
        RulesFabric.TryCreateProcessorRuleNoMoveOnFilledBlocks(jsonObject, parentJsonObject, this.appEngine);
        RulesFabric.TryCreateProcessorRuleMoveInsideBorders(jsonObject, parentJsonObject, this.appEngine);
        RulesFabric.TryCreateProcessorRuleMoveRobot(jsonObject, parentJsonObject, this.appEngine);
        RulesFabric.TryCreateProcessorRuleBlueBulletsAreEaten(jsonObject, parentJsonObject, this.appEngine, this.packmanService);
        RulesFabric.TryCreateProcessorRuleGameOverIfTouchRobot(jsonObject, parentJsonObject, this.appEngine, this.packmanService);
        RulesFabric.TryCreateProcessorRuleRaspberryAreEaten(jsonObject, parentJsonObject, this.appEngine, this.packmanService);
        RulesFabric.TryCreateProcessorRuleRaspBerryShow(jsonObject, parentJsonObject, this.appEngine, this.packmanService);

        if(!jsonObject.childs) { return; }
        for(let child of jsonObject.childs){
            this.addGraphProcessors(child, jsonObject);
        }
    }
}