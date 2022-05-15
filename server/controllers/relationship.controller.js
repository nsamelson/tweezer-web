const firebase = require('../firebase/firebase.connect');
const { getFirestore, collection, getDocs, getDoc, doc, updateDoc, deleteDoc, addDoc, setDoc, Timestamp } = require('firebase/firestore/lite')
const { getAuth } = require('firebase/auth')


const Relationship = require('../models/Relationship');

const db = getFirestore(firebase)
const auth = getAuth(firebase);

// get all relationships
const getRelationships = async ( req,res, next)=>{

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
            res.json(relsArray)
        }
    } catch(error){
        res.status(400).json(error.message);
    }

}

// add a relationship between users
const addRelationship = async ( req,res, next) => {
    const data = req.body

    try{
        const newData = {
            "follower_id": data.follower_id,
            "following_id": data.following_id,
            "created_at": Timestamp.now()
        }

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
}

// get relationship by id
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

// delete relationship
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
