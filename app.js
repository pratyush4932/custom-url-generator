import express from 'express';
import bodyParser from 'body-parser';
import DB_Operation from './database/db_Operation.js';
import path,{dirname} from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
config();

const app = express();
const PORT = process.env.PORT || 5000;
const db = new DB_Operation(); //Creating an object of the DB_Operation class
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const regex=/[^A-Za-z1-9]/g;
const DOMAIN_URL = process.env.DOMAIN_URL;

//Middleware to parse JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs'); // Set the view engine to ejs

//This is the default route, which will render our home page
app.get('/', (req, res) => {
  res.render('index',{
    userlongUrl:"",
    userCustom_name:"",
    custom_link:"",
  });
});

//This route will be used to handle the POST request made by the form on the homepage
app.post('/',(req,res)=>{
    console.log(req.body);
    let userlongUrl = req.body.longUrl;
    console.log(userlongUrl);
    let userCustom_name = req.body.custom_name;
    let customURL="";

  //If the custom name contains any special characters then redirect to the home page
    if (userCustom_name.match(regex) != null){
    res.redirect("/");
    }else{
        const isPresent= db.findNAmeInDB(userlongUrl,userCustom_name);

 //If the custom name is already present in the database then display a message or displays the custom URL
        isPresent.then((result)=>{
            if(result == 0){
                customURL = DOMAIN_URL + "/" + userCustom_name;
            }else{
                customURL = "This name is already taken";
            }
            res.render('index',{
                userlongUrl:userlongUrl,
                userCustom_name:userCustom_name,
                custom_link:customURL,
            });
        });
    }
})

//This route will be used to redirect the user to the original URL
app.get("/:name", (req, res) => {
    const name = req.params.name;
    console.log(name);  
    const isLinkPresent = db.getLinkFromDB(name);//This function will return the original URL

    //If the custom name is present in the database then redirect to the original URL
    isLinkPresent.then((response) => {
      console.log("Redirecting to " + response);
      res.redirect(response);
    });
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});//