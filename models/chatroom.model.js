const mongoose = require('mongoose');

var chatroomSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    city: {
        type: String
    }
});

// Custom validation for email
chatroomSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

mongoose.model('account', chatroomSchema);


var contentChatchema = new mongoose.Schema({
    idUser: {
        type: String,
        required: 'This field is required.'
    },
    content: {
        type: String
    },
    timeCreated: {
        type: String
    },
    timeUpdated: {
        type: String
    }
});

mongoose.model('contentChat', contentChatchema);