const bcrypt = require('bcrypt');
const UserValidationService = require('./../services/UserValidationService');
const {queryMethod} = require("../modules/mysqlModule");
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    if (req.body.username && req.body.password) {
        const validate = UserValidationService(req.body, 'login');

        if (!validate.isValid) {
            res.json({failedFields: validate.failed}).end();
        }

        try {
            const {username, password} = req.body;
            let sql = 'SELECT * FROM `users` WHERE `username` = ?';
            const result = await queryMethod(sql, [username]);
            const isTruePassword = result.length ? bcrypt.compareSync(password, result[0].password) : null;

            if (!result.length) {
                res.json({message: "User not found.", isOk: false}).end();
            } else if (isTruePassword) {
                const accessToken = jwt.sign(
                    {
                        id: result[0].id,
                        username: result[0].username
                    },
                    process.env.TOKEN_KEY,
                    {expiresIn: '24h'}
                );

                res.json({message: "Everything is ok.", isOk: true, accessToken: accessToken}).end();
            } else {
                res.json({message: "Password is wrong.", isOk: false}).end();
            }
        } catch (e) {
            console.error(e);
            res.json({message: "Something went wrong.", isOk: false}).end();
        }
    } else {
        res.json({message: "Username are password are required", isOk: false}).end();
    }
}

exports.register = async (req, res) => {
    const validate = UserValidationService(req.body, 'register');

    if (!validate.isValid) {
        res.json({failedFields: validate.failed}).end();
    }

    try {
        const {username, email} = req.body;
        let sql = 'SELECT * FROM `users` WHERE `username` = ? OR `email` = ?';
        const result = await queryMethod(sql, [username, email]);

        let failed = [];
        result.forEach(elem => {
            if (elem.username === req.body.username && !failed.includes("username")) {
                failed[failed.length] = "username";
            }
            if (elem.email === req.body.email && !failed.includes("email")) {
                failed[failed.length] = "email";
            }
        })

        if (failed.length) {
            res.json({failedFields: failed}).end();
        } else {
            const {firstName, lastName, password} = req.body;
            const hashPassword = await bcrypt.hash(password, 7);
            const sql = "INSERT INTO users (firstName, lastName, email, username, password) VALUES (?, ?, ?, ?, ?)";
            const values = [firstName, lastName, email.toLowerCase(), username, hashPassword];

            try {
                const addingResponse = await queryMethod(sql, values);
                res.json({addingResponse, message: "Registered successfully."}).end();
            } catch (e) {
                console.error(e);
                res.json({message: e.message}).end();
            }
        }
    } catch (e) {
        console.error(e);
        res.json({message: e.message}).end();
    }
}