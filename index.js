var express = require('express');
var app = express();
var fs = require('fs');
var file = "adjs.db";
var exists = fs.existsSync(file);
var http = require('http');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

if(!exists) {
	fs.openSync(file,'w');
}

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//display main page
app.get('/', function(request, response) {
	response.render('pages/index');

});

//grab images
app.get('/images/*',function(request,response){
	var img = fs.readFileSync(request.params[0]);
	response.writeHead(200,{'Content-Type':'image/png'});
	response.end(img,'binary');
});

//post results to mTurk
app.post("https://www.workersandbox.mturk.com/mturk/externalSubmit?*",function(request,response){
	console.log("this does work");
});


app.get('/adjs/*', function(request,response){
	var attr = request.params[0];
	console.log(attr);
	db.all("SELECT * FROM adjectives where attr = '" + attr + "'", function(err,row){
		response.json(row);
		console.log(row);
	});
});

app.get('/workers/*',function(request,response){
	var id = request.params[0];
	var boo = true;
	var res = "";
	db.all("select * from workers", function(err,row){
		//console.log(row);
		for(i = 0; i< row.length; i++){
			//console.log(row[i].id + ' ' + id);
			if(row[i].id == id){
				boo = false;
				res = '0';
			}
			if(i == row.length -1 && boo){
				var prep = db.prepare('insert into workers values (?)');
				prep.run(id);
				prep.finalize();
				res='1';
			}
		}
		response.send(res);
	});
	
})

app.post('/adjs/*',function(request, response){
	console.log(request.body.circleData);
	response.send("OK");

})


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


