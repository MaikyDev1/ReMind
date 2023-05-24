const router = require('express').Router();
const path = require('path');

function isAuthenticated(req, res, next){
    if(req.isAuthenticated())
        return next()
    res.redirect("/auth/login")
}

function isNotAuthenticated(req, res, next){
    if(req.isAuthenticated())
        return res.redirect("/")
    next()
}

const data = require("../database/models/user_data");
const posts = require("../database/models/posts_data");

router.get('/profile/image/:tagId/:fromWhat', async (req, res) => {
    var options = {
        root: path.join(__dirname, '../../content'),
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      }
    if(req.params.tagId != null)
        if(req.params.fromWhat == "uuid")
            res.sendFile(`/profile_pictures/${req.params.tagId}.png`, options);
        else {
            let user = await data.findById(req.params.tagId);
            res.sendFile(`/profile_pictures/${user.profile_picture}.png`, options);
        }
    else
        res.redirect('/404');
})

router.get('/create/new/game', isAuthenticated, async (req, res) => {
    
})

router.post('/create/new/post', isAuthenticated, async (req, res) => {
    const post = await posts.create({
        user_id: req.user.id,
        posted_by: req.user.username,
        post_date: Date.now(),
        game: req.body.game,
        likes: 0,
        comments: {},
        content: {
            title: req.body.title,
            description: req.body.description,
            image: req.body.image
        }
    });
    const savedUser = await post.save();
    console.log(post);
    res.redirect("/home");
})

router.get('/profile/user/:userId/:getWhat', async (req, res) => {
    let id = req.params.userId;
    let getWhat = req.params.getWhat;
    let user = await data.findById(id);
    switch(getWhat) {
        case "name":
            res.send(user.username);
            break;
        case "user_id":
            res.send(post.user_id);
            break;
        case "post_date":
            res.send(post.post_date);
            break;
        case "likes":
            res.send(post.likes);
            break;
        case "description":
            res.send(post.content[0].description);
            break;
        case "image":
            res.send(post.content[0].image);
            break;
        case "all":
            res.send(post);
            break;    
    }
})

router.get('/get/post/:postId/:getWhat', async (req, res) => {
    let id = req.params.postId;
    let getWhat = req.params.getWhat;
    let post = await posts.findById(id);
    switch(getWhat) {
        case "game":
            res.send(post.game);
            break;
        case "user_id":
            res.send(post.user_id);
            break;
        case "post_date":
            res.send(post.post_date);
            break;
        case "likes":
            res.send(post.likes);
            break;
        case "description":
            res.send(post.content[0].description);
            break;
        case "image":
            res.send(post.content[0].image);
            break;
        case "all":
            res.send(post);
            break;    
    }
})

router.get('/internal/get/request/:posts_number', async (req, res) => {
    let amount = Number(req.params.posts_number);
    res.send(await getRandomDocuments(posts, amount));
})

const getRandomDocuments = async (Model, count) => {
    try {
      const randomDocuments = await Model.aggregate([{ $sample: { size: count } }]);
      return randomDocuments;
    } catch (error) {
      throw new Error(error);
    }
  };

module.exports = router;