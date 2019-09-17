server.get('/test', (req,res) =>{

    const { name }  = req.query;
    
    db.find({"name": name.toUpperCase()})
        .then(dataset =>{
            res.send(dataset);
        })
        .catch(err =>{
            console.log(err);
        })

})


server.get('/test2', (req,res) =>{

    const { club }  = req.query;
    console.log(club);
    
    
    db.find({"club": club.toUpperCase()})
        .then(dataset =>{
            res.send(dataset);
        })
        .catch(err =>{
            console.log(err);
        })

})

db.find().skip(offset * 10).limit(10)
.select("-NIF -address -zip_code -phone_number -phone_number2 -email -license_inscription_date -expiration_date -price")