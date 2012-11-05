//!ref: C:\p2\Oulunew\Oulu3D\OgreScene\Props\sun.txml
/*
A test snippet for demonstrating how we will be adding stuff to scene via GUI. So gui clickedButton() or what ever it is called in Qt calls for CheckSelected and passes the text,
which is in string the selected prop or other gadget. 

*/

if (server.IsRunning()){
    var text = "Sun";
    CheckSelected(text);
}
else{
    var text = "Sun";
    CheckSelected(text);
}

function CheckSelected (text){
  //Need to check if all props in one or separate arrays.
  var propArray = ["Sun", "Clouds", "Moon", "Rainbow", "SnowFlakes", "Rain", "Volcano"];
  
  for(i = 0; i<propArray.length; i++){
    if(propArray[i] == text){
      var ent = scene.LoadSceneXML(asset.GetAsset("C:/p2/Oulunew/Oulu3D/OgreScene/Props/" + propArray[i] + ".txml").DiskSource(), false, false, 0);
      return;
    }else
      print('text is wrong.');
  }
 
}