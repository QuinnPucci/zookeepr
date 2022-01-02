const fs = require('fs');
const path = require('path');
const express = require('express')
const PORT = process.env.PORT || 3001;
const app = express()
app.use(express.static('public'));

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }))
// parse incoming json
app.use(express.json())

const { animals } = require('./data/animals');

// search query handling function
function filterByQuery (query, animalsArray) {
    let personalityTraitsArray = []
    let filteredResults = animalsArray
    // using an array to handle searching by multiple personality traits
    if (query.personalityTraits) {
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits]
        } else {
            personalityTraitsArray = query.personalityTraits
        }
        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter(
                animal => animal. personalityTraits.indexOf(trait) !== -1
            )
        })
    }

    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet)
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species)
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name)
    }
    return filteredResults
}

// function for returning single animal when searching by id
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// function to create new animals from POST
function createNewAnimal (body, animalsArray) {
    const animal = body;
    animalsArray.push(animal)
    fs.writeFileSync(
        path.join (__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray}, null, 2)
    )
    return animal
}

// function for validating animals 
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false
    } 
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
      }
      return true;
}

// main get 
app.get ('/api/animals', (req,res) => {
    let results = animals
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results)
})

// get for searching for one animal by ID 
app.get ('/api/animals/:id', (req,res) => {
    const result = findById(req.params.id, animals)
    if (result) {
    res.json(result)
    } else {
        res.send(404)    
    } 
})

// post for adding new animals to the server
 app.post('/api/animals', (req, res) => {
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

 // gets to open proper html pages
 app.get( '/', (req,res) => {
     res.sendFile(path.join(__dirname, './public/index.html'))
 })
 app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
})
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
})
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

// port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
})