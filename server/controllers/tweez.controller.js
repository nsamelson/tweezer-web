const firebase = require('../firebase/firebase.connect');
const { getFirestore, collection, getDocs, getDoc, doc, updateDoc, deleteDoc, addDoc, setDoc, Timestamp, where, query, orderBy} = require('firebase/firestore/lite')
const { getAuth } = require('firebase/auth')
const { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable} = require('firebase/storage')
var URL = require('url');

const {
    getRelationships,
    } = require('../controllers/relationship.controller');

const Tweez = require('../models/Tweez');

const db = getFirestore(firebase)
const auth = getAuth(firebase);
const storage = getStorage(firebase);

/**
 * GET method that returns a list of Tweez objects
 * 
 * @query
 * name: filter the tweezes by username  
 * id: filter the tweezes by the user_id
 * follower: get the tweezes of only the users by giving user id
 * 
 */
const getTweezes = async (req,res,next)=>{

    try{
        const requery = req.query
        var tweezesRef = collection(db,'tweezes')
        var q

        if (requery.name != undefined){
            const name = requery.name
            q = query(tweezesRef, where("username","==",name))
            
        }
        else if(requery.id != undefined){
            const id = requery.id

            q = query(tweezesRef, where("user_id","==",id))
        }
        else if(requery.follower != undefined){

            response = await getRelationships(req,res,next,true)
            var users = []
            response.forEach((user) =>{
                users.push(user.following_id)
            })            
            q = query(tweezesRef, where("user_id","in",users))
        }
        else{
            q = query(tweezesRef)
        }

        const data = await getDocs(q)
        const tweezesArray = []
        // res.json(data)

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

                tweezesArray.push(tweez)
            })
            res.json(tweezesArray)
            // res.json(data)
            
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
 * image : add a photo 
 */
const addTweez = async (req,res,next) => {


    const file = req.file
    var imageUrl = ""
    var content = req.body.content


    // add image to the firebase storage
    if (file !== undefined){
        const imageRef = ref(storage, 'tweezes/'+file.originalname);
        const metatype = { 
            contentType: file.mimetype, 
            name: file.originalname,
            };
        const snapshot = await uploadBytes(imageRef, file.buffer, metatype)
        imageUrl = await getDownloadURL(snapshot.ref);

    }



    // ==================================== working thing below==================
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
            "image":imageUrl,
            "content":content, 
            "likes":0, 
            "profile_picture":user["profile picture"], 
            "user_id": id, 
            "user_liked":[] 
        }
        // console.log(newData)

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
    const id = req.params.id;
    try {
        var data = JSON.parse(req.body.data);
    }catch {
        var data = req.body;
    }

    try {
        // const id = req.params.id;
        // const data = req.body;

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