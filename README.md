# 3380_Normalization
This repository contains Normalization program that is build for Database Systems with Dr. Carlos Ordonez, Fall 2021.

The program is able to determine normalization of tables up to BCNF. As well as provide appropriate messages for INVALID tables. 

nf.txt and nf.sql will update everytime the test case runs on VScode.  
# Requirements:
In order to run this project user's local machine must have node.js. 
 * Node.js link for download (https://nodejs.org/en/)
 * npm packages
# Setup
1. Download the file into your local machine and unzip it. 

   ``` https://github.com/DrNyktersten/3380_Normalization.git ```
2. Install all the dependencies
   
   ``` npm install pg ```
   ``` npm install ```
3. Assign the user, password, host, port, and database. 
   
   ```  
    {
    "host": "3380db.xx.xx.xxx",
    "user": "dbsxxx",
    "password": "dbsxxx",
    "port": xxx,
    "database": "COSCxxxx"
    } 
4. Run the code using your own test case (tables)

   ``` example: node normalize.js "table=hw2_1nf_invalidpkk1k2;pk=k1,k2;columns=a" ```
