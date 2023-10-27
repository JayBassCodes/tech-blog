const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

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