const path = require('path') // Needless to install this npm, because this is Node.js original module
const express = require('express')
const hbs = require('hbs')// hbs is the npm module which creates dynamic web pages and common web parts.
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public')// Here is the directory location which is open to outside
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')// Partials files are common html parts of all html files

// Setup handlebars engine and views location
app.set('view engine', 'hbs')// Tell Express which template engine is used
app.set('views', viewsPath)// Change folder location at which hbs view engine looks into files. Defalt is route/views
hbs.registerPartials(partialsPath)// Set partials path to use partials files

// Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => { // req means request, res means response.
    res.render('index', {
        title: 'Weather App',
        name: 'Tadanobu'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Tadanobu'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Tadanobu'
    })
})

// app.get('', (req, res) => {   //req means request, res means response.
//     res.send('<h1>Weather</h1>')
// })

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error }) // error: error => error  ..short version of ES6
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Tadanobu',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Tadanobu',
        errorMessage: 'Page not found.'
    })
})

app.listen(port, () => {  //port 3000 is used for local. port 80 is http.
    console.log('Server is up on port ' + port)
})