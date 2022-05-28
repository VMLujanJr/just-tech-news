const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method
    User.findAll({
        attributes: { exclude: ['password'] }
    }) // findAll() is the Model's class's method... similar to SELECT * FROM users;
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: { // SELECT * FROM users WHERE id = 1;
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', (req, res) => {
    // expects { username: 'Victor', email: 'vmlujanjr@outlook.com', password: 'pass123' } // we defined these in models/User.js

    /* In MySQL the command looks like this... */
    /* 
    INSERT INTO users
        (username, email, password)
    VALUES
        ('Victor', 'vmlujanjr@outlook.com', 'pass123');
    */
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
/*     .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    }); ...being replaced */
    .then(dbUserData => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;

        res.json(dbUserData);
    });
});

router.post('/login', (req, res) => {
    // query operation = asking question
    // expects { email: 'vmlujanjr@outlook.com', password: 'pass123' }
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email exists!' });
            return;
        }
        
        // verify user
        const validPassword = dbUserData.checkPassword(req.body.password); // checkPassword function was created in models/user.js

        // if verify user returns a boolean...
        if (!validPassword) {
            res.status(400).json({ message: 'The password was incorrect!' });
            return;
        }

        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: ' you are now logged in!' });
        });
    });
});

// logout
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects { username: 'Victor', email: 'vmlujanjr@outlook.com', password: 'pass123' }

    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    /* req.body to provide new data we want to use in the update & req.params.id to indicate where exactly we want that new data to be used */
    /*
    UPDATE users
    SET username = 'Victor', email = 'vmlujanjr@outlook.com', password = 'pass123'
    WHERE id = 1;
    */
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;

/* REST = Representational State Transfer */