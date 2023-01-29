let express = require("express");
let morgan = require("morgan");
let app = express();
let path = require("path");
let cors = require("cors");
let bodyParser = require("body-parser");




//ibclude static files
let staticFiles = path.resolve(__dirname, "subjectPic");
app.use(express.static(staticFiles));

//post request
app.use(bodyParser.urlencoded({extended: true}));
//formatting json documents
app.set("json spaces", 3)
// logger middleware
app.use(morgan("dev"));
app.use(cors());


//1st step of setting up mongo db connection
let propertiesReader = require('properties-reader');
//retrieving properties from db.properties
let propertiesPath = path.resolve(__dirname, "conf/db.properties");
let properties = propertiesReader(propertiesPath);
let dbPprefix = properties.get("db.prefix");
//URL-Encoding of User and PassWorD
//for potential special characters
let dbUsername = encodeURIComponent(properties.get("db.user"));
let dbPwd = encodeURIComponent(properties.get("db.pwd"));
let dbName = properties.get("db.dbName");
let dbUrl = properties.get("db.dbUrl");
let dbParams = properties.get("db.params");
const uri = dbPprefix + dbUsername + ":" + dbPwd + dbUrl + dbParams;

//mongodb connection

const { MongoClient, ServerApiVersion } = require('mongodb');
//const uri = "mongodb+srv://WebIndividual2:WebIndividual2@webindividual2.ugowvfs.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

/*client.connect(err => {
  const collection = client.db("Webstore").collection("lessons");
  // perform actions on the collection object
  client.close();
}); */
let db = client.db(dbName);


let lessons = require("./lessons2");
app.use(cors());

//to get all the requests from the middleware
app.use((req, res, next)=> {
let url = "This is the url" + req.ip;
console.log(url);
next();
})



//getting the lessons

//initalising the collection

app.param("collectionName", (req, res, next, collectionName)=> {
   req.collection = db.collection(collectionName);
   return next()
})

app.get('/collections/:collectionName', function(req, res, next) {
req.collection.find({}).toArray(function(err, results) {
if (err) {
return next(err);
}
res.send(results);
});
});


app.get("/collections/products", (req, res)=> {
  res.redirect("/collections/:collectionName");
})

app.post("/collections/:collectionName", (req, res)=> {
 req.collections.insertOne(req.body, function(err, results) {
  if(err){
    return next(err);
  }
  res.send(results)
 }) 
})

app.put("/", (req, res)=> {
    
})


app.listen("4500",()=> {
    console.log("the app is working on port 4500")
})