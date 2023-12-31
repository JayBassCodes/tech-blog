const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/withauth');

// GET all users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll({
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        });
});

// GET a single user by id
router.get('/:id', (req, res) => {
    User.findByPk(req.params.id, {
        // exclude the password property
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'content', 'created_at']
            },
            // include the Comment model here:
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
            },
        ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' })
                return;
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        });
});

// POST a user
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password
    })
        // store user data during session
        .then(dbUserData => {
            req.session.save(() => {
                req.session.user_id = dbUserData.id
                req.session.username = dbUserData.username
                req.session.loggedIn = true

                res.json(dbUserData)
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        });
});

// POST login
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(400).json({ message: 'No user found with that username' })
                return;
            }

            // verify user
            const validPassword = dbUserData.checkPassword(req.body.password)

            if (!validPassword) {
                res.status(400).json({ message: 'Incorrect password' })
                return;
            }

            // store user data during session
            req.session.save(() => {
                req.session.user_id = dbUserData.id
                req.session.username = dbUserData.username
                req.session.loggedIn = true

                res.json({ user: dbUserData, message: 'You are now logged in!' })
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        });
});

// POST logout
router.post('/logout', withAuth, (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            // 204 status means no content found
            res.status(204).end()
        })
    } else {
        // 404 status means not found
        res.status(404).end()
    }
});

// PUT update a user by id
router.put('/:id', withAuth, (req, res) => {
    // pass in req.body instead to only update what's passed through
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' })
                return;
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        });
});

// DELETE a user by id
router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' })
                return;
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        });
});

module.exports = router;