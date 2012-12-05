<html>
<head>

<script language="javascript">
var Scenes = ["Winter", "Mountains", "Meadow", "Forest", "City", "Beach", "Room"];
var Backgrounds = ["NightSky", "DaySky", "Sunset"];
var Elements =["Clouds", "Sun", "Moon", "Rainbow", "SnowFlakes", "Rain", "Volcano"];
var Objects = ["PalmTrees", "Butterflies", "Mushroom", "Tree1", "Tree2", "Rocks", "Walrus", "Bunnies"];
var ManMade = ["Mob", "SnowMan", "SandCastle", "Rocket", "Parasol", "SandToys", "Tombstone", "Pirates", "Car", "Treasure"];
var SpecialEffects = ["Fire", "Smoke", "FireWorks", "PinkElephant", "BlackMonolith", "UFO", "Hearts"];

var Prop = [Scenes,Backgrounds,Elements,Objects,ManMade,SpecialEffects];

var fileName = "/Ref.js";
function getCurrentDirectory(fileName)
{
var syspath = location.href; 
syspath = syspath.toLowerCase();      //把路径名称转换成小写
myPosition = syspath.lastIndexOf("/");  // 获取文件路径中的最后一个"/"

syspath = syspath.substring(0,parseInt(myPosition)+1); // 使用substring函数 截取"/"之前的字符串，就得到当前目录的路径 

syspath = syspath.replace("file:///","");   //这里要把file:///替换为空，否则会报错

syspath = syspath.replace(new RegExp("%20","gm")," ");   // 如果文件名中含有空格，则要还原空格，替换所有的 %20 为 " "

syspath = syspath + fileName; 

return syspath.toString();
}

function WriteJs() 
{ 
    var fso, tf; 
    fso = new ActiveXObject("Scripting.FileSystemObject"); 
	var	pathName = getCurrentDirectory(fileName);
    tf = fso.CreateTextFile(pathName, true); 
	for(var i=0; i<Prop.length; i++)
	{
		for(var j=0; j<Prop[i].length; j++)
		{
			tf.WriteLine("//!ref: Props/"+ Prop[i][j] +".txml");
		}
	}
    
    tf.Close();
	
     
} 
</script>
</head>

<body>
<input type="button" value="WriteJs" onclick="WriteJs()">
</body>
</html>

