var url = require("url");
var router = {};
// Inclusion de Mongoose
var mongoose = require('mongoose');
var idClient =1;

// On se connecte à la base de données
// lancer mongod dans un terminal 
mongoose.connect('mongodb://localhost/blog', function(err) {
  if (err) { throw err; }
});

// Création du schéma pour l enregistrement
var registerSchema = new mongoose.Schema({
  pseudo : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  id	: { type : Number},
  motPass : { type : Number}
});

var postSchema = new mongoose.Schema({
  content : { type : String },
  compte	: { 
	type : mongoose.Schema.ObjectId,
	ref  :'compte2'
  } 
});

// Création du Model pour l enregistrement
var registerModel = mongoose.model('compte2', registerSchema);
var postModel = mongoose.model('post2', postSchema);
 
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
			this.set_info(this.query.info,this.query.id);
		} else if (this.path== "/get_info") {
            this.get_info(this.query.name);
		} else if (this.path== "/get_friends") {
            this.facto(this.query.nb);
		} else if (this.path== "/add_friend") {
            this.facto(this.query.nb);
		} else if (this.path== "/delete_friend") {
            this.facto(this.query.nb);
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
    function (name,pass) {
        this.msg =this.register_proc(name,pass);
        this.send_res();
    },
	
register_proc:
	//http://localhost:1337/register?name=abi&pass=1745
    function (name,pass) {

		/*var register = new registerModel({ pseudo : name});
		register.motPass = pass;
		register.save();
		return register;*/
		
	 mongoose.model('compte2').find({ pseudo : name },function (err,loginCo)
	   {
			if (loginCo == "" )
			{
				var register = new registerModel({ pseudo : name});
				register.motPass = pass;
				register.save();
				return register;
			}
			else console.log("le nom est deja pris");
			
	   });  
    },

delete_compte:
    function (name,pass) {
        this.msg = this.delete_proc(name,pass);
        this.send_res();
    },

delete_proc:
    function (name,pass) {
        mongoose.model('compte2').remove({ pseudo : name , motPass : pass },function(err){
		if(err) return handleError(err);
		});
		return " your account is delete " + name;		
    },
login:
    function (name,pass) {
        this.msg = this.login_proc(name,pass);
        this.send_res();
    },
login_proc:
    function (name,pass) 
	{
		var _this = this;
       mongoose.model('compte2').find({ pseudo : name , motPass : pass },function (err,loginCo)
	   {
			if (loginCo == "" )
			{
				console.log(" le nom n existe pas ");
			}
			else console.log(loginCo);
			return _this.loginCo;
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
    function (info,id) {
        this.msg = this.set_info_proc(info,id);
        this.send_res();
    },
set_info_proc:
	//http://localhost:1337/register?name=abi&pass=1745
    function (info,id) {
		var post = new postModel({ content : info});
		post.compte = id;
		post.save();
		console.log(post);
		return post;
    },
get_info:
    function (n) {
        return (n<=1) ? 1 : n*this.facto_proc(n-1);
    },
get_friends:
    function (n) {
        return (n<=1) ? 1 : n*this.facto_proc(n-1);
    },
add_friend:
    function (n) {
        return (n<=1) ? 1 : n*this.facto_proc(n-1);
    },
delete_friend:
	function (n){
	
	return ((n <=1) ? 1 : fibo_proc(n-2) + fibo_proc(n-1));
},
send_res:
    function() {
        //this.resp.writeHead(200, {'Content-Type': 'text/plain'});
		this.resp.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Header" : "Origin", "Access-Control-Allow-Origin" : "*"});
        this.resp.write(""+this.msg);
        this.resp.end();
    }

};

