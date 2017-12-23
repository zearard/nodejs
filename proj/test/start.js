try{
		//var sPathSrv = "./proj/test/";
		var sPathSrv = "./";
		var Server = require(sPathSrv + "Server.js");
		var server = new Server();
}catch(e){
	console.error("start try catch", e);
}
