const bcrypt = require('bcryptjs');
const db = require('../config/db'); 

const signup = async (req, res) => {
    const { firstname, lastname, email, username, password, country_code, mobile_number } = req.body;

    // console.log(firstname);
    // console.log(lastname);
    // console.log(email);
    // console.log(password);
    // console.log(country_code);
    // console.log(mobile_number);

    
    if (!firstname || !lastname || !email || !username || !password || !country_code || !mobile_number) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
  
        const [existingEmail] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const [existingUsername] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (existingEmail.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        if (existingUsername.length > 0) {
            return res.status(400).json({ message: 'Username already exists' , success: false});
        }

        const hashedPassword = await bcrypt.hash(password, 10); 

   
        const [result] = await db.execute(
            'INSERT INTO users (firstname, lastname, email, username, password, country_code, mobile_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [firstname, lastname, email, username, hashedPassword, country_code, mobile_number]
        );

        
        res.status(201).json({ message: 'User registered successfully' , success:true});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', success:false });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and Password are required" });
    }

  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@docquity\.com$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email address. It must be a @docquity.com email." });
    }

    try {
    
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "User not found. Please sign up." });
        }

        const user = rows[0];  

        
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        return res.status(200).json({ success: true, message: "Login successful." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "An error occurred while logging in." });
    }
};
module.exports = { signup, login };
