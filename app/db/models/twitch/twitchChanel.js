/**
 * Created by juliusz.jakubowski@gmail.com on 08.02.19.
 */

import mongoose from 'mongoose';
import Joi from 'joi';

const twitchChanelSchema = new mongoose.Schema({
    chanelName: {
        type: String,
        trim: true,
        required: true
    },
    chanelId: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: ' is live now'
    },
    userIds: {
        type: Array
    },
    isStreaming: {
        type: Boolean,
        default: true,
        required: true
    }
});

const TwitchChanel = mongoose.model('TwitchChannels', twitchChanelSchema);

/**
 * HELPERS
 */
function validateTwitchChanel( twitchChanel ) {
    const schema = {
        chanelName: Joi.string().required(),
        chanelId: Joi.string().required(),
        profileImageUrl: Joi.string().required(),
        message: Joi.string().required(),
        userIds: Joi.array().items(Joi.string()),
        isStreaming: Joi.boolean().required(),
    };

    return Joi.validate(twitchChanel, schema);
}

exports.TwitchChanel = TwitchChanel;
exports.validateTwitchChanel = validateTwitchChanel;
