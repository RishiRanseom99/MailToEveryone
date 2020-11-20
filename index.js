const express=require('express');
const MongoClient=require('mongodb').MongoClient;
const nodemailer = require('nodemailer');
require('dotenv').config();

const app=express();

const port=process.env.PORT || 3000;

app.listen(port,()=>{console.log(`Hello i'm listening here at port ${port}`)});
app.use(express.static('public'));
app.use(express.json());


async function main()
  {
    console.log("main function is called");
    const uri=process.env.mongodbAPI;
    const client= new MongoClient(uri,{useNewUrlParser: true,useUnifiedTopology: true });

    await client.connect().
    then(()=>{
      console.log("Successfully connected");
    }).catch((err)=>{
      console.log("Error occurred in connecting");
      console.log(err);
    });
    
    //to handle the request made for accessing the no. of groups made to an api "/api"
    app.get('/api', async function (req, res) {
      console.log("get request");
      const groupList=await getGroups(client);
      console.log(groupList);
      res.send(groupList);
    })

    // to handle the request made for adding a mail to a group to a database
    app.post('/addapi',async(request,response)=>{
      console.log(request.body);
      await addSingleItem(client,{
        group:request.body.optionValue,
        mail:request.body.mail
      });
      response.json({status:"ok got ur add mail request"});
    });


  //to handle all request made to send a mail to all email id's of a passed group
    let option;
    app.post('/api',async(request,response)=>{
      console.log('i got a option');
       option=request.body.optionValue;
     // console.log("option selected"+option);
      response.json({status:"ok got ur data option"});

      let mailList=await getMails(client,option);
      console.log("mailList");
      let mails="";
      mailList.map((data,index)=>{
        mails+=data;
        if(index+1!==mailList.length)
         {mails+=",";}
      });
      console.log(mails);
      
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user:process.env.User,
          pass: process.env.Password
        }
      });
      
      let mailOptions = {
        from: 'interntaskmails@gmail.com',
        to: mails,
        subject: 'Sending Email for checking',
        text: 'All your group member have been informed......'
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


  });
  
  }
  main();
  async function getMails(client,option)
  {
    const cursor=await client.db('mailRecords').collection('mails').find({group:option});
    const result=await cursor.toArray();
    
    let grp_list=[];
    if(result)
    {
        result.forEach(entry=>{
            grp_list.push(entry.mail);

        })
        
    }else
    {
        console.log("some error happened in fetching list of groups");
    }
    return(grp_list);
  }
  async function getGroups(client)
  {
    const cursor=await client.db('mailRecords').collection('groups').find({});
    const result=await cursor.toArray();
    let grp_list=[];
    if(result)
    {
        result.forEach(entry=>{
            grp_list.push(entry.grp_name);

        })
        
    }else
    {
        console.log("some error happened in fetching list of groups");
    }
    return(grp_list);
  }
  async function addSingleItem(client,item)
  {
      const result=await client.db('mailRecords').collection('mails').insertOne(item);
      if(result)
      {
          console.log("successfully inserted");
      }else{
          console.log("some wrong happened while inserting the records");
      }
  }
  async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
