export const getUsers = (req, res) => {
    res.json({ message: 'List of users' });
};

export const createUser = (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }
    res.status(201).json({ message: 'User created successfully', user: { name, email } });
};
