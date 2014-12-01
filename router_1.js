var url = require("url");
var router = {};
// Inclusion de Mongoose
var mongoose = require('mongoose');
var util = require("util");
var Schema = mongoose.Schema;


// On se connecte à la base de données, lance mongod dans un terminal 
mongoose.connect('mongodb://localhost/blog', function(err) {
  if (err) { throw err; }
});

// Création du schéma pour l enregistrement
var registerSchema = new mongoose.Schema({
  pseudo : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  content : { type : String },
  id_temp	: { type : Number},
  motPass : { type : Number},
  friend : [ {type : Schema.Types.ObjectId, ref:'compte2'}]
});


// Création du Model pour l enregistrement
var registerModel = mongoose.model('compte2', registerSchema);
 
exports.run_req = function (req, resp) {
    var r = new request(req, resp);
    r.run();
    delete r;
};

var request = function (req, resp) {
    this.req = req;
    this.resp = resp;

    this.msg = "";

    var u = url.parse(req.url, true, true);
    this.path = u.pathname;
    this.query = u.query;
};

request.prototype = {
run:
    function() {
        this.routing();
    },

routing:
    function() {
        if (this.path == "/register") {
            this.register(this.query.name,this.query.pass);
        } else if (this.path== "/delete_compte") {
            this.delete_compte(this.query.name,this.query.pass);
        } else if (this.path== "/login") {
            this.login(this.query.name,this.query.pass);
		} else if (this.path== "/logout") {
            this.logout(this.query.name,this.query.pass);
		} else if (this.path== "/set_info") {
			//http://localhost:1337/set_info?nb=3
			this.set_info(this.query.id_temp,this.query.info);
		} else if (this.path== "/get_info") {
            this.get_info(this.query.id_temp,this.query.name);
		} else if (this.path== "/get_friend") {
            this.get_friend(this.query.id_temp);
		} else if (this.path== "/add_friend") {
            this.add_friend(this.query.id_temp,this.query.name);
		} else if (this.path== "/delete_friend") {
            this.delete_friend(this.query.id_temp,this.query.name);
        } else {
            this.not_found();
        }

    },

not_found:
    function () {
        this.msg = "Function not found";
        this.send_res();
    },

	
register:
	//http://localhost:1337/register?name=abi&pass=1745
    function (name,pass) {
		var _this = this;
	
	 mongoose.model('compte2').find({ pseudo : name },function (err,loginCo)
	   {
			if (loginCo == "" )
			{
				var register = new registerModel({ pseudo : name});
				register.motPass = pass;
				register.save();
				_this.msg = register;
				_this.send_res();
			}
			else  _this.erreur(1);		
	   });  
    },
	

delete_compte:
    function (name,pass) {

        this.msg = this.delete_proc(name,pass);
        this.send_res();
    },
//http://localhost:1337/register?name=patrick&pass=5747
//http://localhost:1337/login?name=patrick&pass=5747
delete_proc:
    function (name,pass) {
        mongoose.model('compte2').remove({ pseudo : name , motPass : pass },function(err){
		if(err) return handleError(err);
		});
		return " your account is delete " + name;		
    },

login:
    function (name,pass) 
	{
		var _this = this;
       mongoose.model('compte2').findOne({ pseudo : name , motPass : pass },function (err,user)
	   {
			if (user == null ) _this.erreur(2);
			else 
			{
				var id_temp= Math.floor(Math.random() * 100000) + +new Date();
				user.id_temp = id_temp;
				user.save(function (e){
					if (e) console.log(e);
					else {
						_this.msg = ""+id_temp;
						_this.send_res();
					}
				});
			}		
	   });  

       		
    },
logout:
    function (name,pass) 
	{
		var _this = this;
       mongoose.model('compte2').findOne({ pseudo : name , motPass : pass },function (err,user)
	   {
			if (user == null ) _this.erreur(2);
			else 
			{
				user.id_temp = 0 ;
				user.save(function (e){
					if (e) console.log(e);
					else {
						_this.msg = ""+user;
						_this.send_res();
					}
				});

			}		
	   });  

    },

set_info:
    function (id_temp,info) 
	{
		var _this = this;		
		if(id_temp != 0){
			mongoose.model('compte2').update({id_temp:id_temp},{content : info},{multi : true }, function ()
			{
				
				mongoose.model('compte2').find({id_temp:id_temp},function(err,loginCo)
				{

					_this.msg = loginCo;
					_this.send_res();
			
				});
			});
		} else 	_this.erreur(2);
    },

get_info:
    function (id_temp,name) {
        var _this = this;
		if( id_temp != 0){
		   mongoose.model('compte2').findOne({ id_temp : id_temp },function (err,loginCo)
		   { 
			   mongoose.model('compte2').findOne({ pseudo : name},function (err,loginAmi)
			   {
				if( loginAmi != null){
					for( var i =0; i< loginCo.friend.length; i++){
						if(loginAmi.id_temp.equals((loginCo.friend[i])))
						{
							_this.msg = loginAmi.content;
							_this.send_res();
						}
					}}
					else _this.erreur(4);	
				});  
			
			}); 
		}else 	_this.erreur(2);		
    },
get_friend:
    function (id_temp) {
        var _this = this;
		if( id_temp != 0){
		   mongoose.model('compte2').findOne({ id_temp : id_temp }).populate("friend","pseudo").exec(function (err, c)
		   {	
						_this.msg = c.friend;
						_this.send_res();

			});  
		}else 	_this.erreur(2);
    },
add_friend:
//http://localhost:1337/add_friend?id_temp=5479e355dd1d72e816ca3166&name=abi
    function (id_temp,name) {
	var _this = this;
	if(id_temp !=0){
		mongoose.model('compte2').findOne({ pseudo : name},function (err,userAmi)
	   {
			
			if (userAmi == null) _this.erreur(3);
			else{
			mongoose.model('compte2').findOne({ id_temp : id_temp },function (err,user)
		   { 
				
				var pasAmi = true;
				for( var i =0; i< user.friend.length; i++){
				if(userAmi._id.equals(user.friend[i]))
				{pasAmi = false;}}
				if(pasAmi){
				user.friend.push(userAmi._id);
				user.save(function (e){
					if (e) console.log(e);
					else {
						_this.msg = ""+user;
						_this.send_res();
					}
				});} 
				else _this.erreur(5);

			});
			}
		 });
		 }else 	_this.erreur(2);
		 				 
    },
delete_friend:
 function (id_temp,name) {
	var _this = this;
	if(id_friend != 0){
		mongoose.model('compte2').findOne({ pseudo : name},function (err,userAmi)
	   {
			if (userAmi == null) _this.erreur(4);
			else{
			mongoose.model('compte2').findOne({ id_temp : id_temp },function (err,user)
		   { 
				
				var Ami = false;
				for( var i =0; i< user.friend.length; i++)
				{
					if(userAmi._id.equals((user.friend[i])))
					{
						Ami = true;
					}
				}
				if(Ami)
				{
				user.friend.pull(userAmi._id);
				user.save(function (e){
					if (e) console.log(e);
					else {
						_this.msg = ""+user;
						_this.send_res();
					}
				});
				} 
				else _this.erreur(4);

			});
	}
		 }); } else _this.erreur(2);
		 				 
    },


erreur :
	function (err) {

	switch(err){
	case 1 :
		this.msg = "le nom est deja pris, veuillez en choisir un autre";
		break;
	case 2 :
		this.msg = " vos identifications sont incorrectes"; 
		break;
	case 3 :
		this.msg = "votre ami n'existe pas";
		break;
	case 4 :
		this.msg = "vous n avez pas cette amis dans votre liste d'amis";
		break;
	case 5 :
		this.msg = "votre ami est deja dans votre liste d'amis";
		break;
		}
	this.send_res();
},

send_res:
    function() {
		this.resp.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Header" : "Origin", "Access-Control-Allow-Origin" : "*"});
        this.resp.write(""+this.msg);
        this.resp.end();
    }

};

