# DemoRuleEngineAngular

## Ajouter une Rule
- ajouter la rule dans la config 
- ajouter le nom de la rule dans src\app\business\constants.ts : Constants.Rules.(RuleName).Name
- créer la rule dans src\app\business\rules
- créer la rule fabric dans src\app\business\fabrics\rules-fabric.ts (use the constant to test the name of the rule)
- ajouter l'ajout de la rule dans src\app\business\app-loader.ts, fonction addGraphProcessors


## Ajouter un Behavior Object (robot)
- ajouter l'object dans la config des behavior
- ajouter le nom de l'object dans src\app\business\constants.ts (Gui.BehaviorObjects)
- ajouter une notification dans src\app\business\constants.ts (Gui.Notifications, incrementer la NotificationKey) 
- ajouter un modelModification dans src\app\business\constants.ts (Gui.ModelModifications, incrementer le ModelModificationKey) 
- ajouter un processor dans src\app\business\constants.ts (Gui.Processsors) 
- ajouter un processor dans src\app\business\graph-processors\
- ajouter la fabric du processor dans src\app\business\fabrics\graph-processors-fabric.ts
- ajouter l'ajout du processor dans src\app\business\app-loader.ts, fonction addGraphProcessors

### affichage au demarrage
- ajouter un guiUpdateSubject.next dans src\app\business\packman\gui-manager-extensions.ts, fonction initBehaviorObjects
- ajouter l'action dans src\app\pages\main-page\main-page-component.ts, fonction onGuiAction
- ajouter l'affichage dans src\app\components\gui-block\gui-block.component.ts

## Si rien ne va plus : 
- Constants.enableLogs
- use this.appEngine.stopGame() to stop logging






