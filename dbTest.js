var fs = require('fs');
var file = "adjs.db";
var exists = fs.existsSync(file);

if(!exists) {
	fs.openSync(file,"w");
}

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
	var circleData = [{"adj":"horrible","value":1},{"adj":"bad","value":3},{"adj":"decent","value":5},{"adj":"good","value":7},{"adj":"great","value":9}];
	/*
	//db.run("Create table Adjectives (adj primary key, val integer, attr text)");

	var stmt = db.prepare("INSERT INTO Adjectives VALUES (?,?,?)");

	for(i = 0;i<circleData.length;i++){
		try{
			stmt.run(circleData[i].adj,circleData[i].value,"worse-better");
		}
		catch(err){
			console.log('whoops');
		}
	}

	stmt.finalize();
	*/
	db.each("SELECT * FROM Adjectives", function(err,row) {
		console.log(row);
	});
});

db.close();