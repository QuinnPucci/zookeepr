const router = require('express').Router()
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals')
const { animals } = require('../../data/animals')

// main get 
router.get ('/animals', (req,res) => {
    let results = animals
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results)
})

// get for searching for one animal by ID 
router.get ('/animals/:id', (req,res) => {
    const result = findById(req.params.id, animals)
    if (result) {
    res.json(result)
    } else {
        res.send(404)    
    } 
})

// post for adding new animals to the server
 router.post('/animals', (req, res) => {
    // set id based on what the index of the array will be
    req.body.id = animals.length.toString()
    
    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.')
    } else {
    // add animal to JSON file and animals array in this function
    const animal = createNewAnimal(req.body, animals)
    res.json(req.body)
    }
 })

 module.exports  = router