const path = require('path')
const { route } = require('../apiRoutes/animalRoutes')
const router = require('express').Router()

 // gets to open proper html pages
router.get( '/', (req,res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'))
})
router.get('/animals', (req, res) => {
   res.sendFile(path.join(__dirname, '../../public/animals.html'));
})
router.get('/zookeepers', (req, res) => {
   res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
})
router.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, '../../public/index.html'));
})

module.exports = router