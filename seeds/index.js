const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { transcode } = require('buffer');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '60fe83c184496f4fe0de5083',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt quidem rem voluptatum excepturi dignissimos quas aliquam, rerum cupiditate laudantium sapiente, eius culpa doloribus debitis exercitationem voluptate similique! Commodi, molestias aspernatur?',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {

                    url: 'https://res.cloudinary.com/dqylycar1/image/upload/v1627617402/yelpCamp/cbjxkcghzbvbvwv1otec.jpg',
                    filename: 'yelpCamp/cbjxkcghzbvbvwv1otec'
                },
                {

                    url: 'https://res.cloudinary.com/dqylycar1/image/upload/v1627617403/yelpCamp/hskty6afi9h50hsxxm7l.jpg',
                    filename: 'yelpCamp/hskty6afi9h50hsxxm7l'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})