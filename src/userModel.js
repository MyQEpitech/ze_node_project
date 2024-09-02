const {PrismaClient} = require('@prisma/client');

const dbClient = new PrismaClient();

const createUser = (form) => {
    const user = dbClient.user.create({
        data: {
            ...form
        }
    });
    return user
};

module.exports = {
    createUser
};