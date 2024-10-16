import express from 'express';
import User from './schema/userschema.js';
import connect from './dbs/dbs.coonect.js';

const app = express();
app.use(express.json());

const authMiddleware = async (req, res, next) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(401).json({ message: 'No user ID provided' });
    }

    try {
        const user = await User.findById(userId);
        if (user) {
            req.user = user;
            next();
        } else {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

const everyoneAccess = (req, res, next) => {
    next();
};

const twoUsers= (req, res, next) => {
    const user = req.user;
    if (user && (user.role === 'user1' || user.role === 'admin')) {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied: Only User1 and User2 can access this route' });
    }
};

const oneUser= (req, res, next) => {
    const user = req.user;
    if (user && user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied: Only Admin can access this route' });
    }
};

app.post('/add-user', async (req, res) => {
    const { name, role } = req.body;

    if (!name || !role) {
        return res.status(400).json({ message: 'Name and role are required.' });
    }

    try {
        const newUser = new User({ name, role });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.get('/public', everyoneAccess, (req, res) => {
    res.send('everyone.');
});

app.get('/two-users/:userId', authMiddleware, twoUsers, (req, res) => {
    res.send('Welcome User1 and Admin.');
});

app.get('/admin/:userId', authMiddleware, oneUser, (req, res) => {
    res.send('Admin only.');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connect();
});
