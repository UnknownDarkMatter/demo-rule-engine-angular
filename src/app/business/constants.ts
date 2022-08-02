export class Constants  {
    static enableLogs = true

    static Gui = 
    {
       "Actions":{
           "Create":"Create",
           "Delete":"Delete",
        },
       "Objects":{
           "FilledBlock":{
            "Name":"FilledBlock"
           },
           "EmptyBlock":{
            "Name":"EmptyBlock"
           },
           "BlueBullet":{
            "Name":"BlueBullet"
           },
           "RaspBerry":{
            "Name":"RaspBerry"
           },
        },
       "BehaviorObjects":{
           "MovingObject":{
               "Name":"moving-object",
               "ObjectType":"PackmanBlock"
            },
            "RobotObject":{
                "Name":"robot-object",
                "ObjectType":"RobotBlock"
            }
         }
    }

    static MapItems = {
      "EmptyBlock":{
         "name": "empty-block"
      }
    }

    static Processors =
    {
      "MovingObject":{
         "Name":"moving-object",
         "NamePropertyOnJson":"NamePropertyOnJson",
         "Position":"position-object"
      },
      "RobotObject":{
          "Name":"robot-object",
          "NamePropertyOnJson":"NamePropertyOnJson",
          "Position":"position-object",
          "MoveGoTo":{
             "Name":"move-goto",
             "Repeat":"repeat",
             "Direction":"direction",
             "WaitMilliSeconds":"wait-milliseconds"
       }
      }
  }

    static JsonObject =
    {
       "Processor":{
           "Name":"processor"
        },
       "Parent":{
           "Name":"parent"
        }
    }
    
    static Notifications =
    {
       "MovingObjectMove":{
           "NotificationKey":1,
           "FriendlyName":"MovingObjectMove"
        },
        "RobotObjectMove":{
            "NotificationKey":2,
            "FriendlyName":"RobotObjectMove"
         },
     }

    static ModelModifications = 
    {
       "MoveMovingObject" : {
           "ModelModificationKey":1
        },
        "MoveRobotObject" : {
            "ModelModificationKey":2
         }
     }
    
    static Rules = 
    {
       "MoveInsideBorders" : {
           "Name":"move-inside-borders"
        },
        "NoMoveOnFilledBlocks" : {
            "Name":"no-move-on-filled-blocks"
         },
         "MoveObject" : {
            "Name":"move-object"
         },
         "MoveRobot" : {
            "Name":"move-robot"
         },
         "BlueBulletsAreEaten" : {
            "Name":"blue-bullets-are-eaten",
            "MapBlockAttributeName":"has-blue-bullet",
            "BlockVisiblePropertyName":"blue-bullet-visible"
         },
         "GameOverIfTouchRobot" : {
            "Name":"game-over-if-touch-robot"
         },
         "RaspBerryAreEaten":{
            "Name":"raspberry-are-eaten"
         },
         "RaspBerryShow":{
            "Name":"raspberry-show",
            "HasRaspberry":"has-raspberry",
            "BlockVisiblePropertyName":"raspberry-visible",
            "RaspBerryEaten":"raspberry-eaten",
         }
     }


}

