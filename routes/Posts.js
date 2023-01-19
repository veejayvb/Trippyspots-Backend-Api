const router = require("express").Router();
const Post = require("../models/Post");

//CREATE POST
router.post('/', async(req, res) =>{
    const newPost = new Post(req.body)
    try{
        const savedPosts = await newPost.save()
        res.status(200).json(savedPosts)       
    }catch(err){
        res.status(500).json(err)
    }
});

//READ (GET)
router.get('/:id', async(req, res) =>{
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    }catch(err){
        res.status(500).json(err)
    }
});

//Read by username (or) by category name
router.get('/', async(req, res) =>{
    const userName = req.query.user;
    const catName = req.query.cat;
    try{
        let posts;
        if(userName){
            posts = await Post.find({username : userName});
            
        }else if(catName){
            posts = await Post.find({
                categories : {
                    $in :[catName]
                }
            })

        }else{
            posts = await Post.find();
        }
        res.status(200).json(posts)
    }catch(err){
        res.json(500).json(err)
    }
})

//UPDATE (PUT)
router.put("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.username === req.body.username) {
        try {
          const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );
          res.status(200).json(updatedPost);
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json("You can update only your post!");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });


  //Delete
  router.delete("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.username === req.body.username) {
        try {
          await post.delete();
          res.status(200).json("Post has been deleted...");
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json("You can delete only your post!");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

  
module.exports = router;
  