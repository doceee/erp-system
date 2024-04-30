const express = require('express');
const router = express.Router();
const userValidation = require('../validation/users');
const uuidValidator = require('../validation/uuid');
const validate = require('../middleware/validation');
const isAdmin = require('../middleware/isAdmin');
const isLoggedIn = require('../middleware/isLoggedIn');

module.exports = di => {
    const indexController = di.get('controllers.user.indexController');
    const showController = di.get('controllers.user.showController');
    const storeController = di.get('controllers.user.storeController');
    const updateController = di.get('controllers.user.updateController');
    const deleteController = di.get('controllers.user.deleteController');

    router.get(
        '/:id',
        [isLoggedIn, isAdmin],
        [uuidValidator('id'), validate],
        (...args) => showController.invoke(...args)
    );

    router.delete(
        '/:id',
        [isLoggedIn, isAdmin],
        [uuidValidator('id'), validate],
        (...args) => deleteController.invoke(...args)
    );

    router.post(
        '/',
        [isLoggedIn, isAdmin],
        [userValidation.create, validate],
        (...args) => storeController.invoke(...args)
    );

    router.put(
        '/:id',
        [isLoggedIn, isAdmin],
        [uuidValidator('id'), userValidation.update, validate],
        (...args) => updateController.invoke(...args)
    );

    router.get('/', [isLoggedIn, isAdmin], (...args) =>
        indexController.invoke(...args)
    );

    return router;
};
