const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-karina:112545@cluster0.gbw5o.mongodb.net/wikiDB?retryWrites=true&w=majority");

const articleSchema = {
    title: String, 
    content: String
}
const Article = new mongoose.model("Article", articleSchema);
// =======================================

app.route('/articles')
.get(function (req, res) {
    Article.find(function (err, foundArticle) {
        if (!err) {
            res.send(foundArticle);
        } else {
            res.send(err);
        }
    })
})
.post(function (req, res) {

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })

    newArticle.save(function (err) {
        if (!err) {
            res.send('Successfully added a new item');
        } else {
            res.send(err);
        }
    });
})
.delete(function (req, res) {
    Article.deleteMany(function (err) {
        if (!err) {
            res.send('Successfully delete all articles');
        } else {
            res.send(err);
        }
    })
});


app.route('/articles/:articleTitle')
    .get(function (req, res) {

        Article.findOne(
            {title: req.params.articleTitle}, 
            (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles were found " + err);
            }
        })
    })
    .put(function (req, res) {
        {
            Article.updateOne(
                {title: req.params.articleTitle},
                {title: req.body.title, content: req.body.content},
                (err) => {
                    if (!err) {
                        res.send('Successfully updated article!')
                    } else {
                        res.send(`Error: ` + err);
                    }
                })
        }
    })
    .patch(function (req, res) {
        Article.updateOne(
            {title: req.params.articleTitle}, 
            {$set: req.body},
            (err) => {
                if (!err) {
                    res.send('Successfully patched article!')
                } else {
                    res.send(`Error: ` + err);
                }
            })
    })
    .delete(function (req, res) {
        Article.deleteOne(
            {title: req.params.articleTitle}, 
            (err) => {
                if (!err) {
                    res.send('Successfully deleted article!')
                } else {
                    res.send(`Error: ` + err);
                }
            })
    });

// =======================================

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
 
app.listen(port, function() {
  console.log("Server started succesfully");
}); 