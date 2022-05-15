class Tweez {
    constructor(id, username, created_at, image,
            content, likes, profile_picture, user_id, user_liked ) {
            this.id = id;
            this.username = username;
            this.created_at = created_at;
            this.image = image;
            this.content = content; 
            this.likes = likes;
            this.profile_picture = profile_picture; 
            this.user_id = user_id; 
            this.user_liked = user_liked
            
    }
}

module.exports = Tweez;