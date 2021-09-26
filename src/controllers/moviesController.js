const db = require('../database/models');
const sequelize = db.sequelize;
const moment = require("moment");

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        return res.render("moviesAdd")
    },
    create: function (req, res) {
        db.Movie.create({
            title: req.body.title,
            rating: req.body.rating,
            awards: req.body.awards,
            release_date: req.body.release_date,
            length: req.body.length
        })

        return res.redirect("/movies")
    },
    edit: function(req, res) {
        db.Movie.findByPk(req.params.id)
            .then(Movie => res.render("moviesEdit", 
                {Movie, release_date : moment(Movie.release_date).format("YYYY-MM-DD")}))
            .catch(error => error)
    },
    update: function (req,res) {
        db.Movie.update({
            ...req.body
        },
        {
            where: {
                id: req.params.id
            }
        })
        return res.redirect("/movies")
    },
    delete: function (req, res) {
        // TODO
    },
    destroy: function (req, res) {
        db.Movie.destroy({
            where: {
                id: req.params.id
            }
        })
        return res.redirect("/movies")
    }

}

module.exports = moviesController;