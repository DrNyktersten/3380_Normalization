const fs = require('fs');
const file_path = "./nf.sql";

fs.truncate(file_path, 0, function(){})

async function write_sql_script(content)
{
    fs.appendFileSync(file_path, "\n\n" + content + "\n\n", err=>{
        if(err){
            console.error(err);
            return;
        }
    });
}

module.exports = {
    write_sql_script
}