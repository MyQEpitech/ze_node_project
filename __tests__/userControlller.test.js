const { mockDeep } = require('jest-mock-extended');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { register } = require('../src/userController');
const { PrismaClient } = require('@prisma/client');

// Mocking PrismaClient
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn(() => mockDeep()),
}));

// Mocking bcrypt and jwt
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('UserController - register', () => {
    let req, res, dbClient;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                username: 'testuser',
                password: 'Password123!',
                firstName: 'Test',
                lastName: 'User',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        dbClient = new PrismaClient();
    });

    // it('should create a new user and return a token', async () => {
    //     bcrypt.hash.mockResolvedValue('hashedPassword');
    //     dbClient.user.create.mockResolvedValue({
    //         email: req.body.email,
    //         username: req.body.username,
    //         firstName: req.body.firstName,
    //         lastName: req.body.lastName,
    //     });
    //     jwt.sign.mockReturnValue('fakeToken');

    //     await register(req, res);

    //     expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
    //     expect(dbClient.user.create).toHaveBeenCalledWith({
    //         data: {
    //             email: req.body.email,
    //             username: req.body.username,
    //             password: 'hashedPassword',
    //             firstName: req.body.firstName,
    //             lastName: req.body.lastName,
    //         },
    //     });
    //     expect(jwt.sign).toHaveBeenCalledWith(expect.any(Object), process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 * 24 });
    //     expect(res.status).toHaveBeenCalledWith(201);
    //     expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    //         message: 'User created successfully',
    //         data: {
    //             username: req.body.username,
    //             email: req.body.email,
    //             firstName: req.body.firstName,
    //             lastName: req.body.lastName,
    //             token: 'fakeToken',
    //         },
    //     }));
    // });

    // it('should return 400 if validation errors exist', async () => {
    //     req = {
    //         body: {},
    //     };

    //     const validationErrors = {
    //         isEmpty: jest.fn().mockReturnValue(false),
    //         array: jest.fn().mockReturnValue([{ msg: 'Invalid data' }]),
    //     };

    //     jest.spyOn(require('express-validator'), 'validationResult').mockReturnValue(validationErrors);

    //     await register(req, res);

    //     expect(res.status).toHaveBeenCalledWith(400);
    //     expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Invalid data' }] });
    // });

    it('should handle server errors gracefully', async () => {
        bcrypt.hash.mockRejectedValue(new Error('hash error')); 

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
});
