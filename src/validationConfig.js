const {body, validationResult} = require('express-validator');
const { PrismaClient } = require('@prisma/client')

const dbClient = new PrismaClient()

const registerformRules = [
    body('email').notEmpty().withMessage("Email is required").bail()
                .isEmail().withMessage("Invalid email address.").bail()
                .custom(async (value) => {
                    const user = await dbClient.user.findUnique({where:{email: value}})
                    if(user)
                        throw new Error("This email is already in use")
                    return true
                }),
    body('username').notEmpty().withMessage("Username is required").bail()
    .isLength({min: 4, max: 16}).withMessage("Your username must contain between 4 and 16 characters").bail()
    .custom(async (value) => {
        const user = await dbClient.user.findUnique({where:{username: value}})
        if(user)
            throw new Error("This username is already in use")
        return true
    }),
    body('password').notEmpty().withMessage("Password is required").bail()
                    .isLength({min: 8}).withMessage("Your password must be at least 8 characters long").bail()
                    .matches(/[A-Z]/).matches(/[a-z]/).matches(/\d/).matches(/[@$!%*?&]/).withMessage("Your password must contain at least one uppercase letter, one lowercase letter, one digit and one special character (@$!%*?&)"),
    body('password_confirmation').notEmpty().withMessage("Your must confirm your password").bail()
                                .custom((value, {req}) => {
                                    if (value !== req.body.password)
                                        throw new Error("Password fields don't match.");
                                    return true;
                                }),
    body('firstname').optional().isLength({min: 2, max:50}).withMessage("The first name field should be at least 2 and at most 50 characters long").bail().isAlpha(),
    body('lastName').optional().isLength({min: 2, max:50}).withMessage("The last name field should be at least 2 and at most 50 characters long").bail().isAlpha()
    ]

module.exports = {
    validationResult,
    registerformRules
};