/**
 * Created by juliusz.jakubowski@gmail.com on 17.11.18.
 */

const mongoose = require('mongoose');

mongoose.connect(
    'mongodb://localhost/genres',
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => console.log('connected to db'))
    .catch(err => console.log('db connection error ', err));
