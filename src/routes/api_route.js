const router = require('express').Router();
const path = require('path');
var mongoose = require('mongoose');
let admins = [];
let games = [ "Minecraft", "Fortnite", "League of Legends", "PlayerUnknown's Battlegrounds", "Counter-Strike: Global Offensive", "Apex Legends", "Dota 2", "Call of Duty: Warzone", "Grand Theft Auto V", "Overwatch", "Valorant", "Roblox", "Among Us", "Rocket League", "World of Warcraft", "FIFA", "Hearthstone", "Destiny 2", "The Legend of Zelda: Breath of the Wild", "Assassin's Creed Valhalla", "The Witcher 3: Wild Hunt", "Terraria", "Genshin Impact", "The Sims 4", "Red Dead Redemption 2", "Rainbow Six Siege", "Monster Hunter: World", "Pokémon Sword and Shield", "Super Smash Bros. Ultimate", "Animal Crossing: New Horizons", "Cyberpunk 2077", "Mortal Kombat 11", "Final Fantasy XIV", "Fall Guys: Ultimate Knockout", "Call of Duty: Modern Warfare", "Farming Simulator 19", "NBA 2K21", "Madden NFL 21", "GTA Online", "Mortal Kombat X", "Borderlands 3", "Tom Clancy's The Division 2", "Warframe", "Rust", "Call of Duty: Black Ops Cold War", "Star Wars Jedi: Fallen Order", "Death Stranding" ]

const multer = require('multer');
const upload = multer({ dest: path.join(__dirname + '../../../content/user-upload') });
const pfp = multer({ dest: path.join(__dirname + '../../../content/profile_pictures') });

function isAuthenticated(req, res, next){
    if(req.isAuthenticated())
        return next()
    res.redirect("/auth/login")
}

function isNotAuthenticated(req, res, next){
    if(req.isAuthenticated())
        return res.redirect("/home")
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
          'x-sent': true,
          'Content-Type': 'image/png',
          'Content-Disposition': 'inline'
        }
    }
    if(req.params.tagId != null)
        if(req.params.fromWhat == "uuid") {
            res.sendFile(`/profile_pictures/${req.params.tagId}`, options);
        } else if(req.params.fromWhat == "user_id") {
            console.log(mongoose.isValidObjectId(req.params.tagId));
            if(!mongoose.isValidObjectId(req.params.tagId))
                return;
            let user = await data.findById(req.params.tagId);
            if(user != null)
                res.sendFile(`/profile_pictures/${user.profile_picture}`, options);
        }
    else
        res.redirect('/404');
})

router.get('/cdn/uploaded/image/:imageName', async (req, res) => {
    var options = {
        root: path.join(__dirname, '../../content'),
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true,
          'Content-Type': 'image/png',
          'Content-Disposition': 'inline'
        }
    }
   res.sendFile(`/user-upload/${req.params.imageName}`, options);
})

router.get('/create/new/game', isAuthenticated, async (req, res) => {
    
})

router.get('/internal/get/games/all', async (req, res) => {
    res.send(games);
})

// USER UPDATE
// 401 - no access
// 400 - bad req
// 200 - sters
router.post('/internal/user/update/:updateWhat/:profileID', pfp.single('file'), async (req, res) => {
    let what = req.params.updateWhat;
    let profile_id = req.params.profileID;
    if(req.user == null)
        return res.sendStatus(401);
    if(req.user.id != profile_id)
        return res.sendStatus(401);
    switch(what) {
        case "image": {
            if(req.file != null) {
                await data.findByIdAndUpdate(req.user.id, { profile_picture: req.file.filename })
                return res.sendStatus(200);
            } else
                return res.sendStatus(400);
            break;
        }
    }
})


router.get('/profile/user/:userId/:getWhat', async (req, res) => {
    let id = req.params.userId;
    let getWhat = req.params.getWhat;
    if(!mongoose.isValidObjectId(id))
        return;
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

router.get('/internal/validate/:check/:value', async (req, res) => {
    let checkWhat = req.params.check;
    let value = req.params.value;
    switch(checkWhat) {
        case "email":
            if(await data.findOne({ "email": value }) == null) {
                res.sendStatus(200);
                return;
            }
            break;
        case "username":
            if(await data.findOne({ "username": value }) == null) {
                res.sendStatus(200);
                return;
            }
            break;  
    }
    res.sendStatus(302)
})

// ==================== POSTS ===========================================================

router.post('/internal/post/create/new', upload.single('file'), isAuthenticated, async (req, res) => {
    const post = await posts.create({
        user_id: req.user.id,
        posted_by: req.user.username,
        post_date: Date.now(),
        game: req.body.game,
        likes: [],
        comments: {},
        content: {
            title: req.body.title,
            description: req.body.description,
            image: (req.file != null ? req.file.filename : "no_image")
        }
    });
    const savedUser = await post.save();
    await data.findByIdAndUpdate(req.user.id, {$push: { posts: savedUser.id }})
    return res.redirect("../../../../home");
})

// POST DELETE
// THIS WILL DELETE ANY POSTS by the ID
// 401 - no access
// 400 - bad req
// 200 - sters
router.get('/internal/post/delete/:post_id/:delete', async (req, res) => {
    let id = req.params.post_id, can_delete = req.params.delete;
    if(!mongoose.isValidObjectId(id)) {
        res.sendStatus(400);
        return;
    }
    let post = await posts.findById(id);
    if(post == null)
        return res.sendStatus(404);
    if(req.user == null)
        return res.sendStatus(401);
    // Users post
    if(post.user_id === req.user.id) {
        if(can_delete === "true") {
            await posts.findByIdAndRemove(id);
            await data.findByIdAndUpdate(req.user.id, {$pull: { posts: id }})
        }
        res.sendStatus(200);
    } else if(admins.includes(req.user.id)) {
        if(can_delete === "true") {
            await posts.findByIdAndRemove(id);
            await data.findByIdAndUpdate(req.user.id, {$pull: { posts: id }})
        }
        res.sendStatus(200);
        // nu lol
    } else {
        res.sendStatus(401);
        return;
    }
})

router.get('/internal/get/request/:posts_number', async (req, res) => {
    let amount = Number(req.params.posts_number);
    res.send(await getRandomDocuments(posts, amount));
})

router.get('/internal/get/request/user/posts/:userId', async (req, res) => {
    let id = req.params.userId;
    if(!mongoose.isValidObjectId(id))
        return;
    let usr = await data.findById(id);
    let toSend = [];
    for(post of usr.posts) {
        if(!mongoose.isValidObjectId(post))
            continue;
        toSend.push(await posts.findById(post));
    }
    res.send(toSend);
})

const getRandomDocuments = async (Model, count) => {
    try {
      const randomDocuments = await Model.aggregate([{ $sample: { size: count } }]);
      return randomDocuments;
    } catch (error) {
      throw new Error(error);
    }
};

router.get('/get/post/:postId/:getWhat', async (req, res) => {
    let id = req.params.postId;
    let getWhat = req.params.getWhat;
    if(!mongoose.isValidObjectId(id))
        return;
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

// ==================== POST PROCESSING (LIKE/DELETE/COMMENT/LOAD/REQUEST/EDIT) (Voi muri implementnad astea help me)

// 401 - no access
// 400 - bad req
// 200 - success
// 900 - liked
router.get('/internal/post/like/:post_id', async (req, res) => {
    let id = req.params.post_id;
    if(!mongoose.isValidObjectId(id))
        return res.sendStatus(400);
    if(req.user == null)
        return res.sendStatus(401);
    if((await posts.findById(id)).likes.includes(req.user.id)) {
        res.sendStatus(900)
        return;
    }
    await posts.findByIdAndUpdate(id, {$push: { likes: req.user.id }})
    await data.findByIdAndUpdate(req.id, {$push: { liked: id }})
    res.sendStatus(200)
})

// 304 nu are
// 200 removed 
router.get('/internal/post/unlike/:post_id', async (req, res) => {
    let id = req.params.post_id;
    if(!mongoose.isValidObjectId(id))
        return;
    if(!(await posts.findById(id)).likes.includes(req.user.id)) {
        res.sendStatus(304)
        return;
    }
    await posts.findByIdAndUpdate(id, {$pull: { likes: req.user.id }})
    res.sendStatus(200)
})

// 400 - bad req
// 404 - not found
// json - commends
router.get('/internal/get/request/comments/:post_id', async (req, res) => {
    let id = req.params.post_id;
    if(!mongoose.isValidObjectId(id)) {
        res.sendStatus(400);
        return;
    }
    let post = await posts.findById(id);
    if(post == null)
        return res.sendStatus(404);
    res.send(post.comments.slice(1));
})

// 400 - bad req
// 404 - not found
// json - commends
router.get('/internal/post/add/comment/:post_id/:comment', async (req, res) => {
    let id = req.params.post_id;
    if(!mongoose.isValidObjectId(id)) {
        res.sendStatus(400);
        return;
    }
    let post = await posts.findById(id);
    if(post == null)
        return res.sendStatus(404);
    if(req.user == null)
        return res.sendStatus(401);
    await posts.findByIdAndUpdate(id, {$push: { comments: [req.user.id, req.user.username, req.params.comment] }});
    return res.sendStatus(200);
})

module.exports = router;