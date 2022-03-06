const admin = require('firebase-admin');

admin.initializeApp();

const middleware = require('./middleware');

const activity = require('./entities/activity');
const bookmark = require('./entities/bookmark');
const category = require('./entities/category');
const interest = require('./entities/interest');
const itinerary = require('./entities/itinerary');
const journey = require('./entities/journey');
const landmark = require('./entities/landmark');
const location = require('./entities/location');
const post = require('./entities/post');
const review = require('./entities/review');
const savedLandmark = require('./entities/savedLandmark');
const user = require('./entities/user');

exports.middleware = middleware;

exports.activity = activity;
exports.bookmark = bookmark;
exports.category = category;
exports.interest = interest;
exports.itinerary = itinerary;
exports.journey = journey;
exports.landmark = landmark;
exports.location = location;
exports.post = post;
exports.review = review;
exports.savedLandmark = savedLandmark;
exports.user = user;
