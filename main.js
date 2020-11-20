const select=document.getElementsByClassName('groups');

 async function main(){

    const results=await fetch('/api');
    const groupList=await results.json();
    // console.log(data);
    // let groupList=data;
    //let select=document.getElementById('groups');
    groupList.forEach(data=>{
    
    // console.log(select.length);
    for(var i=0;i<select.length;i++)
    {
      var option = document.createElement("option");
      option.text=data;
      select[i].add(option);
    }

    
 })
    
 }

 
 main();
 document.getElementById("addmail").addEventListener("click", async function(event){
  event.preventDefault(); 
  const mail=document.getElementById('mail').value;
  document.getElementById('mail').value="";
  const optionValue=document.getElementById('selectMail').value;
  const options={
    method:'POST',
    headers:{
        'Content-Type':'application/json'
    },
    body:JSON.stringify({optionValue,mail})
    };
    const response=await fetch('/addapi',options);
    const json=await response.json();
    console.log(json);


});

 document.getElementById("submit").addEventListener("click", async function(event){
    event.preventDefault(); 
    const text=document.getElementById("textspace").value;
    const optionValue=select[1].value;
    const options={
      method:'POST',
      headers:{
          'Content-Type':'application/json'
      },
      body:JSON.stringify({optionValue,text})
      };
      const response=await fetch('/api',options);
      const json=await response.json();
      if(response)
      {
        document.getElementById('confirmationMsg').style.visibility = "visible"; 
        console.log(json);
        document.getElementById("textspace").value="Enter your message here"
      }
      else
      {
        document.getElementById('confirmationMsh').value="Not Sent";
      }
  });