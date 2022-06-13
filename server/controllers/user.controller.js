const firebase = require('../firebase/firebase.connect');
const { getFirestore, collection, getDocs, getDoc, doc, updateDoc, deleteDoc, addDoc, setDoc } = require('firebase/firestore/lite')
const { getAuth } = require('firebase/auth')
const {
    changePassword,
    } = require('../controllers/auth.controller');

const User = require('../models/User');

const db = getFirestore(firebase)
const auth = getAuth(firebase);

/**
 * GET method that returns a list of User objects
 * 
 * @query
 *  name : filters the output with the username
 * 
 */
const getUsers = async (req, res, next) => {
    
    try {
        const query = req.query
        const users = collection(db,'users');
        const data = await getDocs(users);
        const usersArray = [];

        if(data.empty) {
            res.status(404).json('No user record found');
        }else {
            data.forEach(doc => {
                const user = new User(
                    doc.id,
                    doc.data().username,
                    doc.data().bio, 
                    doc.data().email, 
                    doc.data().followers, 
                    doc.data().following, 
                    doc.data().password, 
                    doc.data()["profile cover"], 
                    doc.data()["profile picture"], 
                    doc.data()["search history"], 
                    doc.data().tweezes
                    
                );

                //if filtering by user
                if (query.name != undefined){
                    const name = query.name.toLowerCase()
                    
                    // if name inside the username
                    if (user.username.toLowerCase().includes(name)){
                        usersArray.push(user);
                    }
                }
                else{
                    usersArray.push(user);
                }
                
            });
            res.json(usersArray);
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}

/**
 * POST method that creates a new user
 * 
 * @body
 * - username: the username a user chooses (unique)  
 * - email: email address to connect  
 * - password: password 
 */
const addUser = async (req, res, next) => {
    try {
        var data = JSON.parse(req.body.data);
        email = data.email.value
        password = data.password.value
        username = data.username.value
    }catch {
        var data = req.body;
        email = data.email
        password = data.password
        username = data.username
    }
    // const data = req.body;
    var id 

    // get id of new user created in the auth section
    try{
        const user = auth.currentUser
        id = user.uid
    } catch (error) {
        res.status(400).json({"message": error.message});
    }

    // create user doc
    try {
        const newData = {
            "id": id,
            "username": username,
            "email": email,
            "password": password,
            "bio": "",
            "followers":0,
            "following":0,
            "tweezes":0,
            "search history": [],
            "profile picture": "https://firebasestorage.googleapis.com/v0/b/tweezer-ecam.appspot.com/o/profiles%2FProfile%20pictures%2Fblank-profile-picture-973460_1280.webp?alt=media&token=ee3911d9-d138-4b6c-8b0e-32e157da82b6",
            "profile cover": "https://firebasestorage.googleapis.com/v0/b/tweezer-ecam.appspot.com/o/profiles%2FProfile%20covers%2Fdefault-cover.webp?alt=media&token=c1611beb-78b3-4914-824b-d566995a91c2"
        }
        
        // add in the database
        const newUser = doc(db,'users',id);
        await setDoc(newUser, newData)
            .then(()=>{
                res.json({"message": "new user information created"});
            }).catch((error) => {
                res.status(400).json({"message": error.message});
            })
        
    } catch (error) {
        res.status(400).json({"message": error.message});
    }
}

//TODO: put in a User object
/**
 * GET method that returns a single user with the id
 * 
 * @params
 * id: id of the user
 */
const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = doc(db,'users',id);
        const data = await getDoc(user);
        if(!data.exists) {
            res.status(404).json({"message":'user with the given ID not found'});
        }else {

            // TODO: adapt in the client the user params 'profile picture' and 'profile cover'
            // try{
            //     const user = new User(
            //         data.id,
            //         data.data().username,
            //         data.data().bio, 
            //         data.data().email, 
            //         data.data().followers, 
            //         data.data().following, 
            //         data.data().password, 
            //         data.data()["profile cover"], 
            //         data.data()["profile picture"], 
            //         data.data()["search history"], 
            //         data.data().tweezes
                    
            //     );
            //     console.log(user)
            //     res.json(user)
            // }
            // catch (err){
            //     res.status(400).json({"message": err.message});
            // }

            res.json(data.data());
        }
    } catch (error) {
        res.status(400).json({"message": error.message});
    }
}

// TODO: add other fields to modify (e.g. profile picture and cover)
/**
 * PUT method that updates the user information
 * 
 * @params
 * id: user id
 * 
 * @body
 * - bio: the bio of the user
 * - profile_cover
 * - profile_picture
 * 
 */
const updateUser = async (req, res, next) => {
    try {
        
        const id = req.params.id;
        const data = req.body;
        const user = doc(db,'users',id);

        if (data.password !== undefined){
            changed = await changePassword(req,res,next, data.password)
            if (changed == "password changed"){
                await updateDoc(user, data)
                    .then(() => {
                        res.json({"message": "user updated"});
                    }).catch((error)=>{
                        res.status(404).json({"message":'user with the given ID not found'});
                    })
            }
        }
        else if(data.bio !== undefined){
            await updateDoc(user, {bio: data.bio})
                .then(() => {
                    res.json({"message": "user updated"});
                }).catch((error)=>{
                    res.status(404).json({"message":'user with the given ID not found'});
                })
        }
        

    } catch (error) {
        res.status(400).json({"message": error.message});
    }
}

//TODO: DELETE ALL LINKS plus get from the redirect of auth
/**
 * DELETE method to delete a user  
 * DO NOT USE
 * 
 * @params
 * id: user id
 */
const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = doc(db,'users',id)
        await deleteDoc(user)
            .then(() => {
                res.json({"message": "user deleted"});
            }).catch((error)=>{
                res.status(404).json({"message":'user with the given ID not found'});
            })
    } catch (error) {
        res.status(400).json({"message": error.message});
    }
}




module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser, 
    addUser

}