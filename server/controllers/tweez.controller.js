const firebase = require('../firebase/firebase.connect');
const { getFirestore, collection, getDocs, getDoc, doc, updateDoc, deleteDoc, addDoc, setDoc, Timestamp } = require('firebase/firestore/lite')
const { getAuth } = require('firebase/auth')


const Tweez = require('../models/Tweez');

const db = getFirestore(firebase)
const auth = getAuth(firebase);

/**
 * GET method that returns a list of Tweez objects
 * 
 * @query
 * name: filter the tweezes by username  
 * id: filter the tweezes by the user_id
 * 
 */
const getTweezes = async (req,res,next)=>{
    try{
        const query = req.query
        const tweezesRef = collection(db,'tweezes')
        const data = await getDocs(tweezesRef)
        const tweezesArray = []

        if(data.empty){
            res.status(404).json('No tweez record found');
        } else{
            data.forEach(doc=>{
                const tweez = new Tweez(
                    doc.id,
                    doc.data().username,
                    doc.data().created_at,
                    doc.data().image,
                    doc.data().content,
                    doc.data().likes,
                    doc.data().profile_picture,
                    doc.data().user_id,
                    doc.data().user_liked
                )
                //if filtering by user
                if (query.name != undefined){
                    const name = query.name
                    
                    // if name == the username
                    if (tweez.username == name){
                        tweezesArray.push(tweez);
                    }
                }
                else if(query.id != undefined){
                    const id = query.id

                    if (tweez.user_id == id){
                        tweezesArray.push(tweez);
                    }
                }
                else{
                    tweezesArray.push(tweez);
                }
            })
            res.json(tweezesArray)
            
        }

    }catch (error) {
        res.status(400).json(error.message);
    }
}

/**
 * POST method to add a tweez
 * 
 * @body
 * content : content of the tweet  
 * photo : add a photo //TODO://
 */
const addTweez = async (req,res,next) => {
    const data = req.body
    var id //= "yKy3ioX5hKSOIj0zUpVMvuWtAjx1"
    var user

    // get id of the user using the app
    try {
        const userAuth = auth.currentUser
        id = userAuth.uid
    }catch (error) {
        res.status(400).json(error.message);
    }

    // get the info of the user
    try{
        const userRef = doc(db,'users',id);
        user = await getDoc(userRef);
        user = user.data()

    }catch (error) {
        res.status(400).json(error.message);
    }
    

    // add the actual tweez
    try{
        const newData = {
            "username": user.username, 
            "created_at":Timestamp.now(), 
            "image":"",
            "content":data.content, 
            "likes":0, 
            "profile_picture":user["profile picture"], 
            "user_id": id, 
            "user_liked":[] 
        }

        // add in the DB
        const newTweezRef = collection(db,'tweezes')
        await addDoc(newTweezRef,newData)
            .then(() => {
                res.json({"message": "new tweez created"});
            }).catch((error) => {
                res.status(400).json({"message": error.message});
            })
    }catch (error) {
        res.status(400).json(error.message);
    }
}

/**
 * GET method that returns a specific tweez
 * 
 * @params  
 * id: id of the tweez
 */
const getTweez = async (req, res,next) =>{
    try{
        const id = req.params.id
        const tweezRef = doc(db,'tweezes',id)
        const data = await getDoc(tweezRef)

        if(!data.exists) {
            res.status(404).json({"message":'user with the given ID not found'});
        }else {
            res.json(data.data());
        }
    }catch (error) {
        res.status(400).json({"message": error.message});
    }

}

/**
 * PUT method that updates the tweez by id
 * 
 * @params   
 * id: id of the specific tweez
 */
 const updateTweez = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const ref = doc(db,'tweezes',id);
        await updateDoc(ref, data)
            .then(() => {
                res.json({"message": "tweez updated"});
            }).catch((error)=>{
                res.status(404).json({"message":error.message});
            })
    } catch (error) {
        res.status(400).json({"message": error.message});
    }
}

/**
 * DELETE method that removes a tweez by id
 * 
 * @params
 * id: id of the tweez
 */
const deleteTweez = async (req, res,next) =>{
    try {
        const id = req.params.id;
        const ref = doc(db,'tweezes',id)
        await deleteDoc(ref)
            .then(() => {
                res.json({"message": "tweez deleted"});
            }).catch((error)=>{
                res.status(404).json({"message":'tweez with the given ID not found'});
            })
    } catch (error) {
        res.status(400).json({"message": error.message});
    }
}


module.exports = {
    getTweezes,
    addTweez,
    getTweez,
    updateTweez,
    deleteTweez

}