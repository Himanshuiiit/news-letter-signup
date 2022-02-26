const express = require("express")
const bodyParser = require("body-parser");
const request = require("request")
const https = require("https");
const { Console } = require("console");
require("dotenv").config();

const app = express();
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+ "/signup.html");
});

app.post("/",function(req,res){
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address : email,
                status : "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };
    const JSONData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/"+ process.env.LIST_ID;
    const option = {
        method:"POST",
        auth: "himanshu1:"+ process.env.API_KEY
    }

    const request = https.request(url,option,function(response){

        if(response.statusCode===200) res.sendFile(__dirname+ "/success.html");
        else res.sendFile(__dirname+ "/faliure.html");

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    });
    request.write(JSONData);
    request.end();
    
});

    app.post("/faliure",function(req,res){
        res.redirect("/");
    })

app.listen(process.env.PORT || 3000,function(){
    console.log("The server is live on port 3000");
})

