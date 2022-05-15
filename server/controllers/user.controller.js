const firebase = require('../firebase/firebase.connect');
const { getFirestore, collection, getDocs, getDoc, doc, updateDoc, deleteDoc, addDoc, setDoc } = require('firebase/firestore/lite')
const { getAuth } = require('firebase/auth')


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

// create a new user
const addUser = async (req, res, next) => {
    const data = req.body;
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
            "username": data.username,
            "email": data.email,
            "password": data.password,
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

// get a specific user by id
//TODO: put in a User object
const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = doc(db,'users',id);
        const data = await getDoc(user);
        if(!data.exists) {
            res.status(404).json({"message":'user with the given ID not found'});
        }else {
            res.json(data.data());
        }
    } catch (error) {
        res.status(400).json({"message": error.message});
    }
}

// update a specific user 
//TODO: BEWARE BUY MODIFYING PASSWORD
const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const user = doc(db,'users',id);
        await updateDoc(user, data)
            .then(() => {
                res.json({"message": "user updated"});
            }).catch((error)=>{
                res.status(404).json({"message":'user with the given ID not found'});
            })
    } catch (error) {
        res.status(400).json({"message": error.message});
    }
}

// delete a specific user 
//TODO: DELETE ALL LINKS plus get from the redirect of auth
const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = doc(db,'users',id)
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