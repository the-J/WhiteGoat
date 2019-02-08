/**
 * Created by juliusz.jakubowski@gmail.com on 08.02.19.
 */

import mongoose from 'mongoose';
import Joi from 'joi';

import BOT from '../../../credentials/botCredentials.js';

const botSettingsSchema = new mongoose.Schema({
    // text channel id on which bot will answer
    messageChanelId: {
        type: String,
        required: true
    },
    // who can change twitch module settings
    admins: {
        type: Array,
        default: [ BOT.OWNER ]
    }
});

const Settings = mongoose.model('Settings', botSettingsSchema);

/**
 * HELPERS
 */
function validateSettings( botSettingsSchema ) {
    const schema = {
        messageChanelId: Joi.string().required(),
        admins: Joi.array().items(Joi.string()).required()
    };

    return Joi.validate(botSettingsSchema, schema);
}

exports.Settings = Settings;
exports.validateSettings = validateSettings;
