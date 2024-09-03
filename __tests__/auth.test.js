const request = require('supertest');
const app = require('../src/app'); // Assurez-vous que votre app.js exporte l'application Express

describe('Auth features', () => {
    it('should register a user successfully', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                email: 'test@example.com',
                username: 'testuser',
                password: 'Password123!',
                password_confirmation: 'Password123!',
                firstName: 'Test',
                lastName: 'User',
            });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('username', 'testuser');
        expect(response.body.data).toHaveProperty('token');
    });

    it('should fail to register a user with existing email', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                email: 'test2@example.com',
                username: 'testuser2',
                password: 'Password123!',
                password_confirmation: 'Password123!',
                firstName: 'Test',
                lastName: 'User',
            });

        const response = await request(app)
            .post('/auth/register')
            .send({
                email: 'test2@example.com',
                username: 'newuser',
                password: 'Password123!',
                password_confirmation: 'Password123!',
                firstName: 'New',
                lastName: 'User',
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: 'This email is already in use' }),
            ])
        );
    });

    // Ajoutez d'autres tests fonctionnels ici
});
