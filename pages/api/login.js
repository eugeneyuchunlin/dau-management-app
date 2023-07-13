import { resolve } from "styled-jsx/css";
import db from "../../database"
import { createHash } from 'crypto'

var cookie = require('cookie')


function validation(username, password) {
    return new Promise((resolve, reject) => {
        const hash_password = createHash('sha256').update(password).digest('hex');
        console.log(hash_password) 
        const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
        const params = [username, hash_password];
        db.get(sql, params, (err, row) => {
            // reject(500);
            if (err) {
                reject(500);
            } else if (row === undefined) {
                resolve(404);
            } else {
                resolve(200);
            }
        });
    })
}

export default async function handler(req, res) {
    return new Promise((resolve, reject)=>{
        if (req.method === 'POST') {
            
            const { username, password } = req.body;
            validation(username, password).then((code) => {
                if(code === 200){
                    // TODO: should store and generate the session key
                    // Set the user session cookie
                    res.setHeader('Set-Cookie', cookie.serialize('session', JSON.stringify({ isLoggedIn: true, username: username }), {
                        maxAge: 7 * 24 * 60 * 60, // Expires in 30 days
                        // httpOnly: true, // Can only be accessed via HTTP(S)
                        // secure: process.env.NODE_ENV === 'production', // Only works in production
                        sameSite: 'strict', // Cookie is only sent to the same site as the one that originated it
                        path: '/', // Path of the cookie
                    }))
  

                    res.status(200).json({ message: 'ok' });
                }else if(code === 404){
                    res.status(404).json({ message: 'username or password incorrect' });
                }else{
                    res.status(500).json({ message: 'Internal Server Error' })
                }
                resolve();
            }).catch((code, err) =>{
                res.status(code).json({ message: 'Internal Server Error' });
                resolve();
            })
        } else {
            // Handle any other HTTP method
            res.status(405).json({ error: 'only POST method allowed' });
        }
        return;
    })
    
}