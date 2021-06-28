const MongoDB = require('../../utilities/db');
const ObjectId = require('mongodb').ObjectID;
let db;
let snippetCollection;

//se ejecuta cuando se manda a require(este archivo)
(async function(){
    try{
      if (!snippetCollection) {
        db = await MongoDB.getDB();
        snippetCollection = db.collection("tickets");
        if(process.env.ENSURE_INDEX == 1){
          // Vamos a asegurarnos de que exista el indice
        }
      }
    }catch(ex){
      console.log(ex);
      process.exit(1);
    }
})();


module.exports.getById = async (id)=>{
  try {
    const _id = new ObjectId(id);
    const filter =  {_id: _id};
    let row = await snippetCollection.findOne(filter);
    return row;
  } catch(ex){
    console.log(ex);
    throw(ex);
  }
}

module.exports.getByUser = async (sales)=>{
  try{
    const filter = {sales:sales};
    let cursor = snippetCollection.find(filter);
    let rows = await cursor.toArray();
    return rows;
  }catch(ex){
    console.log(ex);
    throw (ex);
  }
}


module.exports.getByHolder = async (lowerLimit, upperLimit, includeExtremes) => {
  try {
    const range = (includeExtremes) ? 
        {"$gte":lowerLimit, "$lte":upperLimit} :
        {"$gt":lowerLimit, "$lt":upperLimit}
    ;
    const filter = { sales: range };
    let cursor = snippetCollection.find(filter);
    let rows = await cursor.toArray();
    return rows;
  } catch (ex) {
    console.log(ex);
    throw (ex);
  }
}

module.exports.addOne = async (name, snippet, user)=>{
  try{
    let newSnippet = {
      name:name,
      snippet:snippet,
      user:user
    };
    let result = await snippetCollection.insertOne(newSnippet);
    return result.ops;
  }catch(ex){
    console.log(ex);
    throw(ex);
  }

}

module.exports.ticketCacher = async (document) => {
  try {
    let result = await snippetCollection.insertOne(document);
    return result.ops;
  } catch (ex) {
    console.log(ex);
    throw (ex);
  }
}

module.exports.close = async (id, keyword) =>{
  try {
    const _id = new ObjectId(id);
    const filter = {"_id": _id};
    const updateObj = {"$push":{"keywords": keyword}};
    let result = await snippetCollection.updateOne(filter, updateObj);
    return result;
  } catch(ex) {
    console.log(ex);
    throw(ex);
  }
}

module.exports.addNote = async (id, keywords) => {
  try {
    const _id = new ObjectId(id);
    const filter = { "_id": _id };
    const updateObj = { "$set": { "keywords": keywords.split(",") } };
    let result = await snippetCollection.updateOne(filter, updateObj);
    return result;
  } catch (ex) {
    console.log(ex);
    throw (ex);
  }
}



module.exports.deleteById = async (id) => {
  try {
    const _id = new ObjectId(id);
    const filter = { _id: _id };
    let row = await snippetCollection.deleteOne(filter);
    return row;
  } catch (ex) {
    console.log(ex);
    throw (ex);
  }
}
