const firebase = require('../firebase/firebase.connect');
const { getFirestore, collection, getDocs, doc, setDoc} = require('firebase/firestore/lite')
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword  } = require('firebase/auth')

const db = getFirestore(firebase);
const auth = getAuth(firebase);


/**
 * POST method to create a new account
 * 
 * @body
 * - email
 * - password
 * - username (unique)
 */
const signup = async (req, res, next) => {
    // const data = req.body;

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
    // console.log(username,)

    // email = data.email
    // password = data.password
    // username = data.username
    const id = username
    const usernamesArray = []

    try {
        const usernamesRef = collection(db,'usernames');
        const docs = await getDocs(usernamesRef);
        docs.forEach( doc => usernamesArray.push(doc.id))
        
        
        if(!usernamesArray.includes(id)) {
            try{
                const usernameRef = doc(db,'usernames',id)
                await setDoc(usernameRef, {}).then(() => {
                    createUserWithEmailAndPassword(auth, email, password)
                        .then((userCredential) => {
                            // Signed in 
                            const user = userCredential.user;
            
                            // console.log("New user created")
            
                            // redirect to add a new user
                            res.redirect(307,'/users')
            
                        })
                        .catch((error) => {
                            res.status(400).json({"message": error.message});
                        });
                })
            } catch (error) {
                res.status(400).json({"message": error.message});
            }
            
        }else {
            res.status(400).json({"message": "username already exists"});
        }
    } catch (error) {
        res.status(400).json({"message": error.message});
    }
    
}

/**
 * POST method to log in the application as an existing user
 * 
 * @body
 * - email
 * - password
 */
const signin = async(req, res,next)=>{
    // const data = req.body;
    try {
        var data = JSON.parse(req.body.data);
        email = data.email.value
        password = data.password.value
    }catch {
        var data = req.body;
        email = data.email
        password = data.password
    }
    

    // console.log(data)
    // console.log(password)
    
    try{
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                res.json({"message": "user connected"})
                // ...
            })
            .catch((error) => {
                res.status(400).json({"message": error.message});
            });
    } catch(error){
        res.status(400).json({"message": error.message});
    } 
    
}

const getCurrentUser = async (req,res,next)=>{
    var user = auth.currentUser;

    if (user) {

        res.redirect('/users/'+user.uid)
    } else {

        res.json({"message": "user not connected"})
    }
}

const changePassword = async (req,res, next, password)=>{
    
    var user = auth.currentUser;
    if (user) {
        await updatePassword(user, password)
            // .then((response)=>{
            //     msg
            //     return "password changed"
            // }).catch((err)=>{
            //     console.log(err)
            // })
        // console.log("did it changed",response)
        msg = "password changed"
        return msg
    }

}


//TODO: change password

//TODO: change email (not important)

//TODO: delete user (not important)


module.exports = {
    signup,
    signin,
    getCurrentUser,
    changePassword
}