const express = require('express');
const { createUser } = require('./userModel');
const { registerformRules, validationResult } = require('./validationConfig')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router();

/********** User registration **********/

router.post('/register', registerformRules, async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({errors: errors.array()});

    let {email, username, password, firstName, lastName} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        password = hashedPassword;
        const user = await createUser({email, username, password, firstName, lastName});
        
        let token = jwt.sign(user, process.env.JWT_SECRET_KEY, {expiresIn: 60 * 60 *24});
        res.status(201).json({
            message: 'User created successfully', 
            data:{
                username: (await user).username,
                email: (await user).email,
                firstName: (await user).firstName,
                lastName: (await user).lastName,
                token: token
        }});
    } catch (error) {
        console.log(error);

        res.status(500).json({error: 'Server error'});
    }
});


module.exports = router;