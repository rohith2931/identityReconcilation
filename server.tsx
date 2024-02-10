const express = require('express');
const dbConnection = require('./db.tsx');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());


// Routes
app.post('/identities',async (req, res) => {
    const request=req.body;
    console.log(request);

    let contactsWithSameEmail;
    let contactsWithSamePhoneNumber;
    
    [contactsWithSameEmail,contactsWithSamePhoneNumber]=await Promise.all([
        queryDatabase(`select * from contacts where email= "${request.email}" order by createdAt desc;`),
        queryDatabase(`select * from contacts where phoneNumber= "${request.phoneNumber}" order by createdAt desc;`)
    ]);

    let emails=[];
    let phoneNumbers=[];
    let secondaryContactIds=[];
    let primaryContactId;
    emails.push(request.email);
    phoneNumbers.push(request.phoneNumber);
    console.log("same email");
    contactsWithSameEmail.forEach(contact =>console.log(contact));
    console.log("same phone number");
    contactsWithSamePhoneNumber.forEach(contact =>console.log(contact));
    console.log("------------------------------------------------");


    if(contactsWithSameEmail.length==0 && contactsWithSamePhoneNumber.length==0){
        let response=await queryDatabase(`INSERT INTO contacts ( phoneNumber, email, linkedId, linkPrecedence, createdAt, updatedAt, deletedAt) 
        VALUES ( '${request.phoneNumber}', '${request.email}', null, 'primary', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', null);`)
        primaryContactId=response.insertId;
    }else if(contactsWithSameEmail.length>0 && contactsWithSamePhoneNumber.length>0){
        if(contactsWithSameEmail[0].createdAt<contactsWithSamePhoneNumber[0].createdAt){
            primaryContactId=contactsWithSameEmail[0].id;
            contactsWithSamePhoneNumber[0].linkPrecedence='secondary';
        }else{
            primaryContactId=contactsWithSamePhoneNumber[0].id;
            contactsWithSameEmail[0].linkPrecedence='secondary';
        }
        var allContacts=[...contactsWithSamePhoneNumber,...contactsWithSameEmail]
        allContacts.forEach(contact=>{
            emails.push(contact.email);
            phoneNumbers.push(contact.phoneNumber);
            if(contact.linkPrecedence=='secondary'){
                secondaryContactIds.push(contact.id);
            }
        })
    }else{
        
        var allContacts=[...contactsWithSamePhoneNumber,...contactsWithSameEmail]
        allContacts.forEach(contact=>{
            
            emails.push(contact.email);
            phoneNumbers.push(contact.phoneNumber);
            if(contact.linkPrecedence=='secondary'){
                secondaryContactIds.push(contact.id);
            }
            if(contact.linkPrecedence=='primary'){
                primaryContactId=contact.id;
            }
        })
        let response=await queryDatabase(`INSERT INTO contacts ( phoneNumber, email, linkedId, linkPrecedence, createdAt, updatedAt, deletedAt) 
        VALUES ( '${request.phoneNumber}', '${request.email}', ${primaryContactId}, 'secondary', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', null);`)
        secondaryContactIds.push(response.insertId);
    }

    res.status(201).send({"contact":{
        "primaryContatctId":primaryContactId,
        "emails": [...new Set(emails)],
        "phoneNumbers": [...new Set(phoneNumbers)],
        "secondaryContactIds": [...new Set(secondaryContactIds)]
    }});
});

// Helper function to execute a query
function queryDatabase(sql) {
    return new Promise((resolve, reject) => {
        dbConnection.query(sql, (error, results) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                // console.log(results);
                resolve(results);
            }
        });
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
