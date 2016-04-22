//Note: the .js is not required as Node assumes these files are javascript
var Discord = require("discord.js")
var RPSManager = require("./RPSManager.js")

//These three required for the fs.readdirSync()
var fs = require( "fs" );
var path = require( "path" );
var process = require( "process" );

var bot = new Discord.Client();
var rpsManager = new RPSManager(bot);
var AuthDetails = require("./auth.json");

var botStartTime = new Date();

var cenaImageFolder = "./cenaImages/";

var cenaImageArray = new Array();
cenaImageArray = fs.readdirSync(cenaImageFolder);//Loops through a given folder and creates an array of file names

//Table catcher object constructor
function TableCatcher(channel){
	this.currentEmotionalState = 0;
	this.emotionalState = ["┬─┬ノ( ゜-゜ノ)", "┬─┬ノ(ಠ益ಠノ)", "┬─┬ノ(ಥ益ಥノ)", "(/ .□.)\ ︵╰(゜Д゜)╯︵ /(.□. \)"]
	this.lastFlipTimestamp = new Date();
	this.channel = channel; 
	this.tableBroken = false;
}
var tableCatcherArray = new Array(); //Keeps all TableCatcher objects

bot.on("message", function(message)
{
	//Make all message content lower case so all triggers can be written lower case and always work.
	var lowerCaseMessage = message.content.toLowerCase();
	
	//help 
	if(message.content.includes("!help")){
		bot.reply(message, "Availible commands *(all commands start with !)* :\r" +
		"help\r" +
		"uptime\r" +
		"battle begin *@player1* *@player2*");
	}
	
	//uptime
	if(message.content.includes("!uptime")){
		var botUptime = Math.abs(new Date() - botStartTime);
		var x = botUptime / 1000;
		var uptimeSeconds = Math.floor(x % 60);
		x /= 60;
		var uptimeMinutes = Math.floor(x % 60);
		x /= 60;
		var uptimeHours = Math.floor(x % 24);
		x /= 24;
		var uptimeDays = Math.floor(x);
		botUptime = "D:H:M:S - " + uptimeDays + ":" + uptimeHours + ":" + uptimeMinutes + ":" + uptimeSeconds;
		bot.reply(message, botUptime);
	}
	
	//John Cena
	if(lowerCaseMessage.includes("and his name is") ||
		lowerCaseMessage.includes("and his name was") ||
		message.content.includes("\uD83C\uDFBA") &&
		!message.author.equals(bot.user)){ //Unicode trumpet
		
		//Reply message	
		bot.reply(message, "\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA**JOHN CENA!**\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA");
		//Get random image path from array
		var randomCenaImageFilePath = cenaImageArray[Math.floor(Math.random() * cenaImageArray.length)];
		//Reply with random cena image
		bot.sendFile(message.channel, cenaImageFolder.concat(randomCenaImageFilePath),"jonny.png", (err, message) => {
			if(err)
				console.log("couldn't send image:", err);
		})
	}
	
	//Table Catcher
	if(message.content.includes("(╯°□°）╯︵ ┻━┻")){
		var channelHasCatcher = false;
		if (tableCatcherArray.length > 0){ //Make sure there's at least 1 object in the array
			for (var i = 0; i < tableCatcherArray.length; i++){ //loop through array to see if object already exists for channel
				var currentTableCatcher = tableCatcherArray[i]; //set new var to current array object
				if (currentTableCatcher.channel.equals(message.channel)){//if the we find an object already exists for the channel
					channelHasCatcher = true;//set flag to true that channel already has object
					if (currentTableCatcher.tableBroken == true && Math.abs(new Date() - currentTableCatcher.lastFlipTimestamp) < 300000){//if table is broken and it's been less than 5 minutes
						bot.reply(message, "*TABLE SHATTERS*: Shamebot's sick of your shit. He'll be back to save the tables in a few minutes.")
						console.log("10");
					}else if (currentTableCatcher.tableBroken == true && Math.abs(new Date() - currentTableCatcher.lastFlipTimestamp) >= 300000){//if table is broken but it's been 5 minutes or more
						currentTableCatcher.tableBroken = false;
						bot.reply(message, currentTableCatcher.emotionalState[currentTableCatcher.currentEmotionalState]);
						console.log("9");
						currentTableCatcher.lastFlipTimestamp = new Date();
						currentTableCatcher.currentEmotionalState++;
					}else{//else -> table is not broken...
						if (Math.abs(new Date() - currentTableCatcher.lastFlipTimestamp) <= 30000){
							bot.reply(message, currentTableCatcher.emotionalState[currentTableCatcher.currentEmotionalState]);
							console.log("8");
							currentTableCatcher.lastFlipTimestamp = new Date();
							if (currentTableCatcher.currentEmotionalState <= currentTableCatcher.emotionalState.length - 2){
								currentTableCatcher.currentEmotionalState++;
							}else {
								//bot.reply(message, currentTableCatcher.emotionalState[currentTableCatcher.currentEmotionalState]);
								console.log("7");
								currentTableCatcher.currentEmotionalState = 0;
								currentTableCatcher.tableBroken = true;
							}
						}else if (Math.abs(new Date() - currentTableCatcher.lastFlipTimestamp) > 30000){
							var timePast = Math.abs(new Date() - currentTableCatcher.lastFlipTimestamp);
							var numberOfIncrementsPast = (timePast / 30000) - 1; //30 seconds is one increment
							
							if (numberOfIncrementsPast < 1){
								//return previous table catch emotion
								currentTableCatcher.currentEmotionalState--;
								bot.reply(message, currentTableCatcher.emotionalState[currentTableCatcher.currentEmotionalState]);
								console.log("6");
								currentTableCatcher.lastFlipTimestamp = new Date();
							}else {
								//decrease emotional states equal to the number of increments to a minimum of 0
								numberOfIncrementsPast = Math.floor(numberOfIncrementsPast);
								if (currentTableCatcher.currentEmotionalState - numberOfIncrementsPast <= 0){
									currentTableCatcher.currentEmotionalState = 0;
									bot.reply(message, currentTableCatcher.emotionalState[0]);
									console.log("5");
								}else {
									currentTableCatcher.currentEmotionalState -=  numberOfIncrementsPast;
									bot.reply(message, currentTableCatcher.emotionalState[currentTableCatcher.currentEmotionalState]);
									console.log("4");
								}
							}
							
							if (currentTableCatcher.currentEmotionalState <= currentTableCatcher.emotionalState.length - 2){
								currentTableCatcher.currentEmotionalState++;
							}else {
								bot.reply(message, currentTableCatcher.emotionalState[currentTableCatcher.currentEmotionalState]);
								console.log("3");
								currentTableCatcher.currentEmotionalState = 0;
								currentTableCatcher.tableBroken = true;
							}
						}
					}
				}
			}
			if (channelHasCatcher == false){
				tableCatcherArray.push(new TableCatcher(message.channel));
				var currentTableCatcher = tableCatcherArray[tableCatcherArray.length - 1];
				bot.reply(message, currentTableCatcher.emotionalState[currentTableCatcher.currentEmotionalState]);
				console.log("2");
				currentTableCatcher.lastFlipTimestamp = new Date();
				currentTableCatcher.currentEmotionalState++;
			}
		}else{
			tableCatcherArray[0] = new TableCatcher(message.channel);
			var currentTableCatcher = tableCatcherArray[0];
			bot.reply(message, currentTableCatcher.emotionalState[currentTableCatcher.currentEmotionalState]);
			console.log("1");
			currentTableCatcher.lastFlipTimestamp = new Date();
			currentTableCatcher.currentEmotionalState++;
		}
	}
	//KoolAid - just the KoolAid man. Ohhhh yeeahh!
	if(lowerCaseMessage.includes("oh no") ||
		lowerCaseMessage.includes("hey koolaid")){
		bot.sendFile(message.channel, "./koolaid.jpg","koolaid.jpg", (err, message) => {
			if(err)
				console.log("couldn't send image:", err);
		});
	}

    // Rock, Paper, Scissors
	if (message.content.substring(0, 7) == "!battle") {
	    rpsManager.parseCommand(message);
	}
	if (message.channel.isPrivate && rpsManager.isBattleOn()) {
	    rpsManager.parseCommand(message);
	}

	// Macho Man!
	if(lowerCaseMessage.includes("savage")) {
		bot.reply(message, "Ohhhh yeah brother!");
		bot.sendFile(message.channel, "./savage.jpg","savage.jpg", (err, message) => {
			if(err)
				console.log("couldn't send image:", err);
		});
	}

		// Tiny Rick!!!!
		if(lowerCaseMessage.includes("tiny rick")) {
			bot.reply(message, "I'm Tiny Rick!!!!!");
			bot.sendFile(message.channel, "./tinyRick.jpg","tinyRick.jpg", (err, message) => {
				if(err)
					console.log("couldn't send image:", err);
			});
		}
});

bot.loginWithToken(AuthDetails.token);
