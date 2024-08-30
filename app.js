const express = require('express');
const app = express();
const prisma = require('@prisma/client').PrismaClient;
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

const prismaClient = new prisma()
app.use(express.json());

app.get('/', (req, res) => res.send("Hello world"));

app.post('/register',  [
    body('email').notEmpty().withMessage("Email is required")
                .isEmail().withMessage("Invalid email address."),
    body('username').notEmpty().withMessage("Username is required")
    .isLength({min: 4, max: 16}).withMessage("Your username must contain between 4 and 16 characters"),
    body('password').notEmpty().withMessage("Password is required")
                    .isLength({min: 8}).withMessage("Your password must be at least 8 characters long")
                    .matches(/[A-Z]/).withMessage("Your password must contain at least one uppercase letter")
                    .matches(/[a-z]/).withMessage("Your password must contain at least one lowercase letter")
                    .matches(/\d/).withMessage("Your password must contain at least one digit")
                    .matches(/[@$!%*?&]/).withMessage("Your password must contain at least one special character"),
    body('password_confirmation').notEmpty().withMessage("Your must confirm your password")
                                .custom((value, {req}) => {
                                    if (value !== req.body.password)
                                        throw new Error("Password fields don't match.");
                                    return true;
                                }),
    body('firstname').optional().isLength({min: 2, max:50}).withMessage("The first name field should be at least 2 and at most 50 characters long"),
    body('lastName').optional().isLength({min: 2, max:50}).withMessage("The last name field should be at least 2 and at most 50 characters long")  
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({errors: errors.array()});

    const {email, username, password, firstName, lastName} = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prismaClient.user.create({
            data: {
                email,
                username,
                firstName,
                lastName,
                password: hashedPassword
            }
        });
        
        res.status(201).json({message: 'User created successfully', user});
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});