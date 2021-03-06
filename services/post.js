const Post = require('../DAOs/post');
const Image = require('../DAOs/image');
const pool = require('../libs/mysql');


class PostService{
    static async postNew(spec, images){
        try{
            var conn = await pool.getConnection();
            await conn.beginTransaction();
            
            let newPost = await Post.insert(conn, spec);
            
            images.forEach( element => {
                element.push(newPost);
            });

            await Image.insertBulk(conn, images);
            await conn.commit();
            return newPost;
        }catch(err){
            conn.rollback();
            throw err;
        }finally{
            pool.releaseConnection(conn);
        }
    }
}


module.exports = PostService;