//const expressJwt = require('express-jwt');
import jwtExpress from 'express-jwt';
import config from '../util/config.json';

module.exports = jwt;

function jwt() {
    const { secret } = config;

    return jwtExpress({ secret }).unless({
        path: [
        '/api/transfer/list',
        '/api/camera/showCameraList',
        /\/api\/transfer\/list.*.jpg/,
        '/api/getAuthToken',
        '/api/transfer/getPicture',
        '/api/transfer/getPicture/',
        '/api/transfer/getpicture/',
        /\/api\/camera\/.*\/.*/,
        '/api/camera/status',
        '/api/cameras'

        ]
    });
}
