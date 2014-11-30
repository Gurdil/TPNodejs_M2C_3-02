var url = require("url");
var router = {};
// Inclusion de Mongoose
var mongoose = require('mongoose');
var util = require("util");
var Schema = mongoose.Schema;
var idClient =1;

// On se connecte à la base de données
// lancer mongod dans un terminal 
mongoose.connect('mongodb://localhost/blog', function(err) {
  if (err) { throw err; }
});

// Création du schéma pour l enregistrement
var registerSchema = new mongoose.Schema({
  pseudo : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  content : { type : String },
  id	: { type : Number},
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
			this.set_info(this.query.id,this.query.info);
		} else if (this.path== "/get_info") {
            this.get_info(this.query.info);
		} else if (this.path== "/get_friend") {
            this.get_friend(this.query.id);
		} else if (this.path== "/add_friend") {
            this.add_friend(this.query.id,this.query.name);
		} else if (this.path== "/delete_friend") {
            this.delete_friend(this.query.id,this.query.name);
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
				register.content = "";
				register.friend = "";
				register.save();
				_this.msg = register;
				_this.send_res();
			}
			else 
			{
				_this.msg ="le nom est deja pris";
				_this.send_res();
			}
			
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
       mongoose.model('compte2').findOne({ pseudo : name , motPass : pass },function (err,loginCo)
	   {
			if (loginCo == "" )
			{
				_this.msg =" le nom n existe pas ";
				_this.send_res();
			}
			else 
			{
				//console.log("AAAAAA - " + util.inspect(loginCo));	
				_this.msg =loginCo._id
				_this.send_res();
		
			}
			
	   });  
	  // return "vous etes connecte " + name ;
       		
    },
logout:
    function (name,pass) {
        this.msg = this.logout_proc(name,pass);
        this.send_res();
    },
logout_proc:
    function (name,pass) {
       mongoose.model('compte2').find({ pseudo : name , motPass : pass },function (err){
		if(err) return handleError(err);
	   });
		return " your are deconnected now ";
    },
set_info:
    function (id,info) {
	var _this = this;		

	mongoose.model('compte2').update({_id :id},{content : info},{multi : true }, function ()
	{
		var __this = _this;
		mongoose.model('compte2').find({_id :id},function(err,loginCo)
		{
			__this.msg = loginCo;
			__this.send_res();
	
		});
	});
		
    },

get_info:
    function (info) {
        var _this = this;
       mongoose.model('compte2').find({ content : info },function (err,loginCo)
	   {
			if (loginCo == null )
			{
				_this.msg =" l info n existe pas ";
				_this.send_res();
			}
			else 
			{	
			
				_this.msg =loginCo;
				_this.send_res();
		
			}
			
	   });  
    },
get_friend:
    function (id) {
        var _this = this;
       mongoose.model('compte2').findOne({ _id : id },function (err,loginCo)
	   {
			console.log(loginCo);
			_this.msg =loginCo.friend;
			_this.send_res();
		
		}
			
	   );  
    },
add_friend:
//http://localhost:1337/add_friend?id=5479e355dd1d72e816ca3166&name=abi
    function (id,name) {
	var _this = this;
 
        mongoose.model('compte2').findOne({ pseudo : name},function (err,loginAmi)
	   {
			var __this = _this;
	   		if (loginAmi == null) 
			{
				_this.msg = "votre ami n existe pas";
				_this.send_res();	
			
			}
		else{
				mongoose.model('compte2').update({_id :id},{$push : {friend : loginAmi._id}},{multi : true }, function (err,nA)
				{
					console.log("nombre de doc mis a jour" + nA);
					mongoose.model('compte2').find({_id :id},function(err,loginCo)
					{
						__this.msg = loginCo;
						__this.send_res();
				
					});
				});
			
			
			}
		 }); 
		 				 
    },
delete_friend:
 function (id,name) {
	var _this = this;
 
        mongoose.model('compte2').findOne({ pseudo : name},function (err,loginAmi)
	   {
			var __this = _this;
	   		if (loginAmi == null) 
			{
				_this.msg = "votre ami n existe pas";
				_this.send_res();	
			
			}
		else{
		
				
				mongoose.model('compte2').update({_id :id},{$pull : { friend : loginAmi._id}},{multi :true},function(err,nA)
				{
					console.log("nombre de document mis a jour: " + nA);
					mongoose.model('compte2').find({_id :id},function(err,loginCo)
					{
						__this.msg = loginCo;
						__this.send_res();
				
					});
			
				});
			
			}
		 }); 
		 				 
    },
send_res:
    function() {
        //this.resp.writeHead(200, {'Content-Type': 'text/plain'});
		this.resp.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Header" : "Origin", "Access-Control-Allow-Origin" : "*"});
        this.resp.write(""+this.msg);
        this.resp.end();
    }

};

