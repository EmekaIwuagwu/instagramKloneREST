var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

app.get('/api/',function(req , res){
    return res.send({error: false,message: 'hello'})
});

var dbConn = mysql.createPool({
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b185bdef62778e',
    password: '15dd7732',
    database: 'heroku_6b2db86bae9468d'
});

// dbConn.connect();
module.exports = dbConn;

//Functions
//register
app.post('/api/register',function(req,res){
    var postData = req.body;
    dbConn.query('INSERT INTO instagramclonedb SET ?', postData, function (error,results,fields){
        if(error) throw error;
        return res.send({error:false, data: results, message: 'OK'});
    });
});

//login
app.post('/api/login', function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    dbConn.query('SELECT * FROM instagramclonedb WHERE username = ? AND password =?', [username,password], function (error, results, fields){
        if(results.length > 0){
            return res.send({error:false, message: 'OK'});
        }else{ 
            return res.send({error: false, message: 'Incrorrect Login Details'});
        }
    });
});

app.post('/api/posts',function(req,res){
    var postData = req.body;
    dbConn.query('INSERT INTO instagramclonedbposts SET ?', postData, function (error,results,fields){
        if(error) throw error;
        return res.send({error:false, data: results, message: 'OK'});
    });
});

app.get('/api/posts/:username', function(req,res){
	let username = req.params.username;
	
	if(!username){
		return res.status(400).send({error: true, message: 'Please provide username'});
	}
	dbConn.query('SELECT * FROM instagramclonedbposts WHERE username =?', username,function(error, results, fields){
		if(error) throw error;
		return res.send({ error:false, data: results, message: 'posts.' });
	});
});

app.listen(port,function(){
    console.log('App running on Port: '+port);
});

module.exports = app;