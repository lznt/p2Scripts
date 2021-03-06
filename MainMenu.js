//!ref: Scripts/Background.ui
//!ref: Scripts/MainMenu.ui
//!ref: Scripts/Prop.ui
//!ref: Scripts/Scene.ui
//!ref: Props/Sun.txml
//!ref: Props/sun.mesh
//!ref: Props/PalmTrees.txml
//!ref: Props/Moon.txml
//!ref: Props/Volcano.txml
//!ref: Props/Walrus.txml
//!ref: Props/Beach.txml
//!ref: Props/DaySky.txml
//!ref: Props/Winter.txml
//!ref: Props/Meadow.txml
//!ref: Props/City.txml
//!ref: Props/Forest.txml
//!ref: Props/Mountains.txml
//!ref: Props/Rocket.txml
//!ref: Props/Buttefly.txml
//!ref: Props/SandToys.txml
//!ref: Props/Room&Window.txml
//!ref: Props/Clouds.txml
//!ref: Props/Sunset.txml
//!ref: Props/NightSky.txml


engine.ImportExtension("qt.core");
engine.ImportExtension("qt.gui");
//engine.ImportExtension("qt.uitools");

/* 
 *	MainMenu includes the submenus(background, prop, scene, clearMenu, clearEntity) 
 *  When you click the buttons ( background, prop, scene) on the interface of MainMenu, it will popup the corresponding submenu at right side of MainMenu
 *  when you click the button (clearMenu) on the interface of MainMenu, it will hind the submenu in the screen
 *  when you click the button (clearEntity) on the interface of MainMenu, it will clear all the entities in the scene. 
 */

var SceneList_visible = false;
var PropList_visible = false;
var BackgroundList_visible = false;
var CurrentClickedItemName = null;

var PropProxy = null;
var SceneProxy = null;
var BackgroundProxy = null;

var _SceneListWidget = null;
var _PropListWidget = null;
var _BackgroundListWidget  = null;
/*
Use these to get added properties into right positions. Divided into 3 groups.
*/

var Scenes = ["Winter", "Mountains", "Meadow", "Forest", "City", "Beach", "Room"];
var Backgrounds = ["NightSky", "DaySky", "Sunset"];
var Elements =["Clouds", "Sun", "Moon", "Rainbow", "SnowFlakes", "Rain", "Volcano"];
var Objects = ["PalmTrees", "Butterflies", "Mushroom", "Tree1", "Tree2", "Rocks", "Walrus", "Bunnies"];
var ManMade = ["Mob", "SnowMan", "SandCastle", "Rocket", "Parasol", "SandToys", "Tombstone", "Pirates", "Car", "Treasure"];
var SpecialEffects = ["Fire", "Smoke", "FireWorks", "PinkElephant", "BlackMonolith", "UFO", "Hearts"];




var ScenePos = [
position1 = {x : -53.98, y: 10.25, z: -73.77},
position2 =  {x : -60.98, y: 7.75, z: -73.77}
];

var SkyPropPos = [
Skyposition1 = {x: -57.33, y: 16.57, z: -79.25},
Skyposition2 = {x: -53.33, y: 17.07, z: -67.75}
];

var GroundPropPos = [
  Groundposition1 = {x: -61.72, y:9.60, z:-67.75},
  //Groundposition2 = {x: ,y: ,z: }

];

var BackgPos = [
position1 = {x:-52.40 ,y:13.29 ,z:-73.83}
];

this.Positions = [ScenePos, GroundPropPos, SkyPropPos, BackgPos];



function Init()
{
// load the file "MainMenu.ui"   
 	var _widget = ui.LoadFromFile("Scripts/MainMenu.ui", false);
 	
 	var _PropBtn = findChild(_widget, "PropBtn");
	_PropBtn.pressed.connect(PropBtnClicked);					// listening to the singal of prop button clicked
	
 	var _SceneBtn = findChild(_widget, "SceneBtn");				
	_SceneBtn.pressed.connect(SceneBtnClicked);					// listening to the singal of SceneBtn button clicked
	
	var _BackgroundBtn = findChild(_widget, "BackgroundBtn");  
	_BackgroundBtn.pressed.connect(BackgroundBtnClicked);		// listening to the singal of background button clicked
	
 	var _ClearMenuBtn = findChild(_widget, "ClearMenuBtn");				
	_ClearMenuBtn.pressed.connect(ClearMenuBtnClicked);			// listering to the singal of clean menu button clicked
	
	var _ClearEntityBtn = findChild(_widget,"ClearEntityBtn");
	_ClearEntityBtn.pressed.connect(RemoveAllEntities);		// listering to the singal of clean entity button clicked

	//Add connects to elements, man made, special effectts and object buttons. 
	
 	var MenuProxy = new UiProxyWidget(_widget);
 
 	ui.AddProxyWidgetToScene(MenuProxy);
    MenuProxy.visible = true;
    MenuProxy.windowFlags = 0;
	
	MenuProxy.x = 860;
	MenuProxy.y = 25;
	
// load the file "Scene.ui"	
	var _SceneWidget = ui.LoadFromFile("Scripts/Scene.ui", false);
	
    _SceneListWidget = findChild(_SceneWidget, "SceneListWidget");
	_SceneListWidget.itemDoubleClicked.connect(SceneListItemDoubleClicked);
	
    SceneProxy = new UiProxyWidget(_SceneWidget);
    
    ui.AddProxyWidgetToScene(SceneProxy);
    SceneProxy.visible = SceneList_visible;   // set the SceneList_visibe = false;
    SceneProxy.windowFlags = 0;
    
    SceneProxy.x = 965;             // they should be caculated late
    SceneProxy.y = 25;


// load the file "Prop.ui"
	var _PropWidget = ui.LoadFromFile("Scripts/Prop.ui", false);
	
	_PropListWidget = findChild(_PropWidget,"PropListWidget");
	_PropListWidget.itemDoubleClicked.connect(PropListItemDoubleClicked);           // listen to the event of item double clicked in PropListWidget
	 
	PropProxy = new UiProxyWidget(_PropWidget);
	
	ui.AddProxyWidgetToScene(PropProxy);
	PropProxy.visible = PropList_visible;
	PropProxy.windowFlags = 0;
    
    PropProxy.x = 965;             // they should be caculated late
    PropProxy.y = 25;
	
// load the file "Background.ui"
	var _BackgroundWidget = ui.LoadFromFile("Scripts/Background.ui", false);
	
	_BackgroundListWidget = findChild(_BackgroundWidget,"BackgroundListWidget");
	_BackgroundListWidget.itemDoubleClicked.connect(BackgroundListItemDoubleClicked);   // listen to the event of item double clicked in BackgroundListWidget
	
	BackgroundProxy = new UiProxyWidget(_BackgroundWidget);
	
	ui.AddProxyWidgetToScene(BackgroundProxy);
	BackgroundProxy.visible = BackgroundList_visible;
	BackgroundProxy.windowFlags = 0;
    
    BackgroundProxy.x = 965;             // they should be caculated late
    BackgroundProxy.y = 25;
	
	
}

/*
 *  handle the mouse event occur on submenu (scene, prop, background, clear).
 *  currently, just implement the effect that click the button once , the submenu will be shown, click the button again, the submenu disappear, do the loop like that 
 */
 
	function SceneBtnClicked(){
      _SceneListWidget.clear();
      for(i = 0; i < Scenes.length; i++){
        _SceneListWidget.addItem(Scenes[i]);
      
      }
     
			SceneProxy.visible = true;
			
			PropProxy.visible = ! SceneProxy.visible;
			BackgroundProxy.visible = ! SceneProxy.visible;
	}
	
	

  function PropBtnClicked(){
    /*
    add new menu opening
    */
	}
	

	function BackgroundBtnClicked(){
      console.LogInfo(_BackgroundListWidget);
			_BackgroundListWidget.clear();
			for(i = 0; i < Backgrounds.length; i++){
        _BackgroundListWidget.addItem(Backgrounds[i]);
			
			}
			BackgroundProxy.visible  = true;
			
			SceneProxy.visible = ! BackgroundProxy.visible;
			PropProxy.visible = ! BackgroundProxy.visible;
	}

	function ClearMenuBtnClicked(){
		
		SceneProxy.visible = false;
		PropProxy.visible = false;
		BackgroundProxy.visible = false;
	}
 	
	




/* 
 * handle the mouse event occur on the submenu
 *
 */
 // how to get the object name from the ListWidget, actully, Object name = ListWidget.item[index].text()    Is this syntax right?
	// 	how to get the number of index
  

 	function SceneListItemDoubleClicked(){
		var type ='Scene';
		CurrentClickedItemName = _SceneListWidget.currentItem().text();
		console.LogInfo(_SceneListWidget.objectName);
		console.LogInfo("CurrentClicked        SceceListItem: " + CurrentClickedItemName);
		LoadXML(CurrentClickedItemName, type);
	}
	
  //Replace with ElementlistDoubleClicked()
	function PropListItemDoubleClicked (){
		CurrentClickedItemName = _PropListWidget.currentItem().text();
		console.LogInfo(_PropListWidget.objectName);
		console.LogInfo("CurrentClicked        PropListItem: " + CurrentClickedItemName);
		LoadXML(CurrentClickedItemName);
	
		
	}
	
	function BackgroundListItemDoubleClicked (){
    
    
    
		CurrentClickedItemName = _BackgroundListWidget.currentItem().text();
		console.LogInfo(_BackgroundListWidget.objectName);
		console.LogInfo("CurrentClicked        BackgroundListItem: " + CurrentClickedItemName);
		
		LoadXML(CurrentClickedItemName);
	}
	
/*
This function is launched if the new added entity has an animationcontroller. If the entity has no animations, we wait and let tundra load them.
After that we launch EnableAnims, which activates animations.
*/
function CheckAnims(ent){
  if(ent.animationcontroller.GetAvailableAnimations().length > 0){
     EnableAnims();
  }else
    frame.DelayedExecute(1.0).Triggered.connect(EnableAnims);
}

/*
Animations have to be named 'SceneAnim' or 'PropAnim'. 
This function is launched when animations have been loaded into the entity and they are usable.
In this.Positions array 0 = Scene Placement, 1 = Prop Placement and 2 = Background placement
*/


function rnd(n){
  seed = new Date().getTime();
  seed = (seed*9301+49297) % 233280;
  return (Math.floor((seed/(233280.0)* n)));
}

function LoadXML (text){

  /*
  effectArray holds all possible props, scenes or backgrounds that can be added into the 3d world with GUI. The name in array has to be exact same as 
  the name of the file in /Props/ folder. variable text is GUI's text of chosen button and is used to compare. Use the table made my Tomi & Paula to get
  right names for effectArray.
  */			   
  
  if(text == null || text == ""){
	  console.LogInfo("You havn't selected any effect");
  }
  else
  {
    //Load entity from file, inside Props folder. assets[0] is entity, so scene.LoadSceneXML returns array.
    //Create a dynamiccomponent for the entity to check if it has been placed into the world already. This way we wont place them again when adding an new entity.
    var assets = scene.LoadSceneXML(asset.GetAsset("Props/" + text + ".txml").DiskSource(), false, false, 0);
    var ent = assets[0];
    var id = assets[0].id;
    ent.placeable.visible = false;
    ent.dynamiccomponent.CreateAttribute('bool', 'Placed');
    if(!ent.animationcontroller && ent.dynamiccomponent.GetAttribute('Placed') == false)
      CheckPlacement(ent);
    else if(ent.dynamiccomponent.GetAttribute('Placed') == false)
      CheckAnims(ent);
   }
}


			  
function CheckPlacement(ent){
			  //CASE1: Entity has no animations and is not placed yet. We place it and set placed to true, depending on if its prop, scene or background. 
			  //TODO: An array for multiple different locations that the entity can be added in.
          if(ent.dynamiccomponent.name == "Prop" || ent.dynamiccomponent.name == "prop"){
            if(ent.dynamiccomponent.GetAttribute('Type') == 'Ground'){
              var idx = rnd(this.Positions[1].length);
              var pos = this.Positions[1][idx];

            }else if(ent.dynamiccomponent.GetAttribute('Type') == 'Sky'){
                var idx = rnd(this.Positions[2].length);
                var pos = this.Positions[2][idx];
            }else {
              console.LogInfo('DynamicComponent Type: Ground or sky missing');
                var pos = this.Positions[2][1];
            }
              
             var tm = ent.placeable.transform;
             tm.pos.x = pos.x;
             tm.pos.y = pos.y;
             tm.pos.z = pos.z;
             ent.placeable.transform = tm; 
             ent.placeable.visible = true;            
             ent.dynamiccomponent.SetAttribute('Placed', true);
             
          }else if (ent.dynamiccomponent.name == "Scene" || ent.dynamiccomponent.name == "scene"){
             var idx = rnd(this.Positions[0].length);
             var pos = this.Positions[0][idx];
             var tm = ent.placeable.transform;
             tm.pos.x = pos.x;
             tm.pos.y = pos.y;
             tm.pos.z = pos.z;
             ent.placeable.transform = tm;
             ent.placeable.visible = true;  
             ent.dynamiccomponent.SetAttribute('Placed', true);
             
          }else if(ent.dynamiccomponent.name == "Background" || ent.dynamiccomponent.name == "background"){
             var idx = rnd(this.Positions[3].length);
             var pos = this.Positions[3][idx];
             var tm = ent.placeable.transform;
             tm.pos.x = pos.x;
             tm.pos.y = pos.y;
             tm.pos.z = pos.z;
             tm.rot.y = 180;
             ent.placeable.transform = tm;  
             ent.placeable.visible = true;
             ent.dynamiccomponent.SetAttribute('Placed', true);
          }
            
}
		
function EnableAnims(ent){
  for(i=0; i<ent.length; i++){
  
     
    
      if(ent[i].dynamiccomponent.name == "Prop" || ent[i].dynamiccomponent.name == "prop"){
      
        if(ent[i].dynamiccomponent.GetAttribute('Type') == 'Ground'){
        
          var idx = rnd(this.Positions[1].length);
          var pos = this.Positions[1][idx];

        }else if(ent[i].dynamiccomponent.GetAttribute('Type') == 'Sky'){
        
          var idx = rnd(this.Positions[2].length);
          var pos = this.Positions[2][idx];
        }else
          var pos = this.Positions[2][1];
        
        var tm = ent[i].placeable.transform;
        tm.pos.x = pos.x;
        tm.pos.y = pos.y;
        tm.pos.z = pos.z;
        ent[i].placeable.transform = tm;
        
        ent[i].animationcontroller.EnableAnimation('PropAnim'); 
        ent[i].placeable.visible = true;
        ent[i].dynamiccomponent.SetAttribute('Placed', true);
        console.LogInfo(ent[i].animationcontroller.GetAvailableAnimations());
        
      }else if(ent[i].dynamiccomponent.name == "Scene" || ent[i].dynamiccomponent.name == "scene"){
      
        var idx = rnd(this.Positions[0].length);
        var pos = this.Positions[0][idx]; 
        var tm = ent[i].placeable.transform;
        tm.pos.x = pos.x;
        tm.pos.y = pos.y;
        tm.pos.z = pos.z; 
        ent[i].placeable.transform = tm;
        

        ent[i].animationcontroller.EnableAnimation('SceneAnim');

        
        ent[i].placeable.visible = true;
        ent[i].dynamiccomponent.SetAttribute('Placed', true);
        console.LogInfo(ent[i].animationcontroller.GetAvailableAnimations());
        
      }else if(ent[i].dynamiccomponent.name == "Background" || ent[i].dynamiccomponent.name == "background"){
      
        var pos = this.Positions[3][0];
        var tm = ent[i].placeable.transform;
        tm.pos.x = pos.x;
        tm.pos.y = pos.y;
        tm.pos.z = pos.z;
        ent[i].placeable.transform = tm;
        ent[i].placeable.visible = true;
        ent[i].dynamiccomponent.SetAttribute('Placed', true);
        
      }
     }
}

			   //print('text doesnt exist.', text, tempArray[i]);
		 
 
  
  
// end of function

/*
Removes all entities that have DynamicComponent, in our case they are user assigned entities.
*/
function RemoveAllEntities(){
  var ents = scene.GetEntitiesWithComponent('EC_DynamicComponent');
  for (i = 0; i<ents.length; i++)
  {
    scene.RemoveEntity(ents[i].Id()); 
  }
  
  console.LogInfo("Executing the funtion of removing all entities")
}



// destory the widget and stop the script running
function OnScriptdestroyed() {
	_widget.deleteLater();
	delete _widget ;
}

// start the script before checking the server whether it is running
//Running on server side
if (server.IsRunning()){
  console.LogInfo("server is running");
}
else{
    
   Init();
   print('Init');
}
