class User {
    constructor(id, username, bio, email, followers, 
        following, password, profile_cover, profile_picture, 
        search_history, tweezes ) {
            this.id = id;
            this.username = username;
            this.bio = bio;
            this.email =  email;
            this.followers =  followers;
            this.following =  following;
            this.password =  password;
            this.profile_cover =  profile_cover;
            this.profile_picture =  profile_picture;
            this.search_history =  search_history;
            this.tweezes = tweezes;
            
    }
}

module.exports = User;