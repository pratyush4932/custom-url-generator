import user from "./connect.js";
import { config } from 'dotenv';
config();

const DOMAIN_URL = process.env.DOMAIN_URL;

//This class is used to perform all the database operations
class DB_Operation{

constructor() {
}

//This function is used to save the NEW data in the database
 async saveInDB (url, custom_name) {
    console.log('Saving in DB!!!')
    const newUser = new user({
        url: url,
        customName: custom_name,
    });
    try {
        const savedUser = await newUser.save();
        return savedUser;
    } catch (err) {
        return err;
        }
    }

//This function is used to check if the custom name is already present in the database    
async findNAmeInDB(url, custom_name){
    console.log('Finding in DB!!!')
    const data = await user.find({customName: custom_name });
    if (data.length == 1) return 1;  //If the custom name is already present
     
    //If the custom name is not present then save the data in the database
    this.saveInDB(url, custom_name);
    return 0;
    }

//This function is used to get the link from the database    
async getLinkFromDB(custom_name){
    const data = await user.find({customName: custom_name });
    if (data.length > 0) return data[0].url; //If the custom name is present in the database
    else return DOMAIN_URL; 
    }
}

export default DB_Operation;