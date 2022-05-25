const firebase = require('../firebase/firebase.connect');
const { getFirestore, collection, getDocs, getDoc, doc, updateDoc, deleteDoc, addDoc, setDoc, Timestamp } = require('firebase/firestore/lite')
const { getAuth } = require('firebase/auth')


const Relationship = require('../models/Relationship');

const db = getFirestore(firebase)
const auth = getAuth(firebase);

/**
 * GET method to return an array of relationships between users
 * 
 * @query
 * - follower: filter with the follower_id
 * - following: filter with the following_id
 */
const getRelationships = async ( req,res, next, doReturn=false)=>{

    try{
        const query = req.query
        const relsRef = collection(db,'relationships')
        const data = await getDocs(relsRef)

        const relsArray = []
        if (data.empty){
            res.status(404).json('No relation record found');
        } else{
            data.forEach(doc=>{
                const rel = new Relationship(
                    doc.id,
                    doc.data().follower_id,
                    doc.data().following_id
                )
                //if filtering by follower_id
                if (query.follower !== undefined){
                    const follower = query.follower 

                    if (rel.follower_id == follower){
                        relsArray.push(rel);
                        
                    }
                }
                else if (query.following !== undefined){
                    const following = query.following  
                                      
                    if (rel.following_id == following){
                        relsArray.push(rel);
                    }
                }
                else{
                    relsArray.push(rel);
                }
            })
            if(doReturn){
                return relsArray
            }
            else{
                res.json(relsArray)
            }
            
        }
    } catch(error){
        res.status(400).json(error.message);
    }

}

/**
 * POST method that creates a rel between 2 users
 * 
 * @body
 * - follower_id: the user that follows another
 * - following_id: the user that is followed
 */
const addRelationship = async ( req,res, next) => {
    try {
        var data = JSON.parse(req.body.data);
        follower_id = data.follower_id
        following_id = data.following_id
    }catch {
        var data = req.body;
        follower_id = data.follower_id
        following_id = data.following_id
    }
    // console.log(follower_id)
    // const data = req.body
    //TODO: maybe get the current user Id
    //TODO: does it changes the number of followers for the users?

    try{
        const newData = {
            "follower_id": follower_id,
            "following_id": following_id,
            "created_at": Timestamp.now()
        }
        // console.log(newData)

        // add in the DB
        const newRelRef = collection(db,"relationships")
        await addDoc(newRelRef, newData)
            .then(() => {
                res.json({"message": "new relation created"});
            }).catch((error) => {
                res.status(400).json({"message": error.message});
            })

    } catch (error) {
        res.status(400).json({"message": error.message});
    }

    // console.log("after the request")
    // get the number
}

/**
 * GET method that returns a single relationship object
 * 
 * @params
 * id: relationship id
 */
const getRelationship = async ( req,res, next) =>{
    try{
        const id = req.params.id
        const relRef = doc(db,'relationships',id)
        const data = await getDoc(relRef)

        if(!data.exists) {
            res.status(404).json({"message":'relationship with the given ID not found'});
        }else {
            res.json(data.data());
        }

    }catch (error) {
        res.status(400).json({"message": error.message});
    }
}

/**
 * DELETE method to delete a relatioship
 * 
 * @params
 * id: id of the relation to delete
 */
const deleteRelationship = async (req, res, next) => {
    try {
        const id = req.params.id;
        const relRef = doc(db,'relationships',id);

        await deleteDoc(relRef)
            .then(() => {
                res.json({"message": "relation deleted"});
            }).catch((error)=>{
                res.status(404).json({"message":'relation with the given ID not found'});
            })

    } catch (error) {
        res.status(400).json({"message": error.message});
    }
}

module.exports = {
    getRelationships,
    addRelationship,
    getRelationship,
    deleteRelationship
}
