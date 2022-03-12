const { Client} = require('pg')
const creds = require('./creds.json')
const file_path_nf = "./nf.sql";
const fs = require('fs');
const { table } = require('console');
const file_path_txt = "./nf.txt";

const client = new Client({
  host: creds.host,
  user: creds.user,
  password: creds.password,
  port: creds.port,
  database: creds.database
});


var tablename="", pk, k_string, pk1, pk2;
params=process.argv[2];

if (process.argv.length<=2) {
  console.log("Invalid Input");
  process.exit();
}

else {

 
 var l=params.split(";")

 var param=[]
 for (i=0;i<l.length;i++)
   param[i]=l[i].split("=");

 for (i=0;i<param.length;i++)
   console.log(param[i]);
}

tablename = param[0][1];
var column_all = param [2][1];
k_string = param[1][1];
pk = k_string.split(",");
var pcolumn = column_all.split(","); 
pk1 = pk[0];
pk2 = pk[1];
pk3 = pk[2];

if(pk.length>2)
{
  write_in_file("null", (tablename + ": Invalid Input\n"))
  console.log("Invalid Input")
  process.exit();
}
// pk_one = pk1.split(",");
// pk_two = pk2.split(",");

  
    if(pk1==undefined && pk2==undefined)
    {
      console.log("Invalid Primary Key");
      process.exit();
    }










//PK validation testing.
//PK validation testing.
//PK validation testing.

async function pk_validation() {
//var pk_test=true;

var results= await client.query(`SELECT ${k_string}, COUNT(*) FROM ${tablename} group by ${k_string}`) // this query will count all the pk that exist at the table and return their count()

for(let i = 0; i<results.rowCount; i++)// then we proceed into the for loop which will count the rows of the pk's
{
    if(parseInt(results.rows[i].count)>1)
    {
        pk_test=false; // if the count is more than 1 it means that there is a repetition and we must return false because pk is invalid
    }
    else 
    {
      pk_test = true; // otherwise if the count is not more than 1 it means that there is no repetition or there is no duplicate rows of the pk's on the table
    }


}
//console.log("PK: " + pk_test)
return pk_test;
}







//one nf
//one nf


async function one_nf_validation() {
  var one_nf_test=true;

  var results= await client.query(`SELECT ${k_string},${column_all}, COUNT(*) FROM ${tablename} group by ${k_string}, ${column_all}`) // similar idea as it was presented in the pk's count, but here we gonna count all of them together including the rest of the columns
  
  for(let i = 0; i<results.rowCount; i++) // same idea for the for loop as it is been used for the pk
  {
      if(parseInt(results.rows[i].count)>1)
      {
          one_nf_test=false; // if the count of the pk's and column's together is more than 1 it means that there is duplicates for the 1nf 
      }
  }
  //console.log("1nf: " + one_nf_test)
  return one_nf_test;
  }
  








///2nf 
///2nf
///2nf
// let one_nf_test = one_nf_validation();
// let pk_test= pk_validation();
// let two_nf_test = two_nf_validation();
async function two_nf_validation() {

  let one_nf_test = await one_nf_validation(); //before procedding into the two_nf check first await for the result of the one_nf function 
  let pk_test= await pk_validation();          //same idea as above before proceeding to two_nf await for pk function

  var two_nf_test=false;
  var count_dependent =0;

    if (pk_test==true && one_nf_test==true) // proceed checking for the two_nf validation if the pk and one_nf is true otherwise return false
    {

        if (pk2 == undefined)
          {
            two_nf_test=true; // if pk2 is not defined 2nf is automatacially true
          }
        

          // if pk2 exists 
          else{
      
      
            for(let i=0; i<pcolumn.length; i++) //1st for loop for the 1 pk
            {
              var results= await client.query(`SELECT ${pk1},COUNT(Distinct ${pcolumn[i]}) FROM ${tablename} group by ${pk1} Having COUNT(Distinct ${pcolumn[i]})>1`) // it counts 1 pk in relation to all the columns  
              
              if(results.rowCount != 0)
              {
                count_dependent+=0; 
      
              }
              else
              {
                count_dependent += 1;
              }
          
            }
          
            for(let i=0; i<pcolumn.length; i++) //2nd loop for the 2nd pk if it exists on the table
            {
                  var results= await client.query(`SELECT ${pk2},COUNT(Distinct ${pcolumn[i]}) FROM ${tablename} group by ${pk2} Having COUNT(Distinct ${pcolumn[i]})>1`) //it counts 2 pk in relation to all the columns
              
                  if(results.rowCount != 0)
                  {
                    count_dependent+=0; 
          
                  }
                  else
                  {
                    count_dependent += 1;
                  }
            }
      
          }



      if(count_dependent==0)
      {
        two_nf_test=true; // if anyone of the for loop return 0 that means that 2nf is true
      }
      else{
        two_nf_test=false; // if it is != 0 it means 2nf is false
      }


    }
    //console.log("2nf " + two_nf_test)

    return two_nf_test;
}


async function three_nf_validation () 
{ 
  let pk_test= await pk_validation();          //before proceeding into the three_nf validation code await for pk_test result
  let two_nf_test = await two_nf_validation(); //before proceeding into the three_nf validation code await for two_nf_test result
  var three_nf_test = true;


    if (pk_test==false || two_nf_test==false) // if any of either pk or two_nf is false it would automatically return false for the three_nf
    {
      three_nf_test = false
    }
    else 
    {
              for(let i =0; i<(pcolumn.length-1); i++) // loop to check for 
        {
            for(let j=i+1; j<pcolumn.length; j++)
            {

               var results = await client.query(`SELECT ${pcolumn[i]},COUNT(Distinct ${pcolumn[j]}) FROM ${tablename} group by ${pcolumn[i]} Having COUNT(Distinct ${pcolumn[j]})>1`)
              
               
               if(results.rowCount == 0)  // if the rowCount == 0 it will return false that means that it is not in three_nf
               {
                 three_nf_test = false; 
               }
            }
          

        }
    }

    return three_nf_test;
}

      

/// bcnf validation
/// bcnf validation
/// bcnf validation
async function bcnf_validation () 
{
  let three_nf_test = await three_nf_validation(); // awaits for the three_nf_validation result before proceeding into the bcnf_validation part
  var count_dependent =0;

    if (three_nf_test==false) 
    {
      return bcnf_test = false; // if three_nf result come up as a invalid it will automatically return invalid for the bcnf
    }
    else 
    {
     
      for(let i=0; i<pcolumn.length; i++) // then we proceed into the two for loop first with the 1 pk
      {
        var results= await client.query(`SELECT ${pcolumn[i]},COUNT(Distinct ${pk1}) FROM ${tablename} group by ${pcolumn[i]} Having COUNT(Distinct ${pk1})>1`)
        
        if(results.rowCount != 0)
        {
          count_dependent+=0; 

        }
        else
        {
          count_dependent += 1;
        }
    
      }
    
      if(pcolumn.length >1) for(let i=0; i<pcolumn.length; i++) // then we proceed into the second loop with where in the table there exists 2 pk
      {
            var results= await client.query(`SELECT ${pcolumn[i]},COUNT(Distinct ${pk2}) FROM ${tablename} group by ${pcolumn[i]} Having COUNT(Distinct ${pk2})>1`)
        
            if(results.rowCount != 0)
            {
              count_dependent+=0; 
    
            }
            else
            {
              count_dependent += 1;
            }
      }
      
      if(count_dependent==0)
      {
        bcnf_test=true;  // if the count_dependent == 0 it will return true 
      }
      else{
        bcnf_test=false;  // otherwise it will be false
      }
    }

    
return bcnf_test;
}
  



















































// fs.truncate(file_path, 0, function(){})

async function write_sql_script(content)
{
    fs.appendFileSync(file_path_nf, "\n\n" + content + "\n\n", err=>{
        if(err){
            console.error(err);
            return;
        }
    });
}

module.exports = {
    write_sql_script
}

async function write_in_file(bool_to_convert, xnf)
{
    var content="";

    if(bool_to_convert==true)
    {
    content = (xnf + " Y");
    }
    else if(bool_to_convert==false){
        content = (xnf + " N");
    }
    else {
      content = (xnf)
    }
    fs.appendFileSync(file_path_txt, content + "\n", err=>{
        if(err){
            console.error(err);
            return;
        }
    });


    if(xnf=="bcnf"){
    fs.appendFileSync(file_path_txt,"\n", err=>{
      if(err){
          console.error(err);
          return;
      }
  });
}

}



async function empty_table (){
  try{
var table_checking = await client.query(`SELECT * FROM ${tablename};`);
await write_sql_script(`checking the table has zero rows\n\nSELECT count(*) AS count FROM ${tablename};`)
var column_checking = await client.query(`SELECT count(*) AS count FROM ${tablename};`);
await write_sql_script(`checking the table has invalid columns\n\nSELECT count(*) AS count FROM ${tablename};`)

if(table_checking.rowCount == 0)
{
  console.log("Empty Table");
  await write_in_file("none", (tablename + ": "+ "Empty Table\n"));

  process.exit();
}

if (column_checking.rowCount != 0)
{
    if (parseInt(column_checking.rows[0].count) == 1)
        {
        console.log("Single Row Table");
        await write_in_file("none", (tablename + ": " + "Single Row Table\n"));

        process.exit();
        }
}

try{
    var coumns = await client.query(`SELECT ${k_string}, ${column_all} FROM ${tablename} LIMIT 2;`);
    //await write_sql_script(--checking the table has invalid columns \n\nSELECT ${pk_string}, ${columns_names} AS count FROM ${table} LIMIT 2;)
}catch(err){
            client.end()
            console.log("Invalid Input"); 
            await write_in_file("none", (tablename + ": "+ "Invalid Input\n"))
            process.exit();
             }
  }catch(err){console.error(err); client.end()}
}







main();

async function main() {
  try {
    client.connect();
    console.log("Connected Succesfully");
  } catch (e) { console.log("Could not Connect"); }  
  await empty_table();
  //client.connect();
  await write_in_file("none", (tablename))
  await pk_validation();
  let pk_test = await pk_validation();
  await write_in_file(pk_test, "pk")
  console.log("pk " + pk_test)

  await one_nf_validation()
  let one_nf_test = await one_nf_validation();
  await write_in_file(one_nf_test, "1nf")
  console.log("1nf " + one_nf_test)

  await two_nf_validation()
  let two_nf_test = await two_nf_validation();
  await write_in_file(two_nf_test, "2nf")
  console.log("2nf " + two_nf_test)

  await three_nf_validation()
  let three_nf_test = await three_nf_validation();
  await write_in_file(three_nf_test, "3nf")
  console.log("3nf " + three_nf_test)

  await bcnf_validation();
  let bcnf_test = await bcnf_validation();
  await write_in_file(bcnf_test, "bcnf")
  console.log("bcnf " + bcnf_test)
  
client.end()
}
