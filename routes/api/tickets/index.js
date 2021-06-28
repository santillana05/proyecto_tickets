const express = require('express');
const router = express.Router();
const {
  getAll,
  getAllFacet,
  addOne,
  addAny,
  getById,
  getBySales,
  getBySalesWithOperator,
  getBySalesRange,
  getByKeyword,
  addKeywords,
  addKeyword,

} = require('./tickets.model');

router.get(
  "/tickets/:estado/:page",
  async (req, res)=>{
    try{
      let rows = await getAll();
      res.status(200).json(rows);
    }catch(ex){
      res.status(500).json({"msg":"Error"});
    }
  }
);

router.get(
  "ticketsbyuser/:estado/:page",
  async (req, res) => {
    try {
      let {page, size} = req.params;
      page = parseInt(page);
      size = parseInt(size);
      let result = await getAllFacet(page, size);
      res.status(200).json({...result, page, size});
    } catch (ex) {
      res.status(500).json({ "msg": "Error" });
    }
  }
);

router.get(
  "/byid/:id",
  async (req, res)=>{
    try{
      let {id} = req.params;
      let row = await getById(id);
      res.status(200).json(row);
    }catch(ex){
      res.status(500).json({ "msg": "Error" });
    }
  }
);

router.get(
  "ticketsbyholder/:estado/:page",
  async (req, res) => {
    try {
      let { holder } = req.params;
      let _holder = parseInt(holder);
      let rows = await getBySales(_holder);
      res.status(200).json(rows);
    } catch (ex) {
      res.status(500).json({ "msg": "Error" });
    }
  }
);


router.post(
  "/new",
  async (req, res)=>{
    try{
      let {name, snippet} = req.body;
      let docInserted = await addOne(name, snippet, 'obetancourth');
      res.status(200).json(docInserted);
    }catch(ex){
      res.status(500).json({"msg":"Error"});
    }
  }
);

router.post(
    "/add_note",
    async (req, res)=>{
      try{
        let {name, snippet} = req.body;
        let docInserted = await addOne(name, snippet, 'obetancourth');
        res.status(200).json(docInserted);
      }catch(ex){
        res.status(500).json({"msg":"Error"});
      }
    }
  );

router.post(
  "/close",
  async (req, res) => {
    try {
      let document = req.body;
      let docInserted = await addAny(document);
      res.status(200).json(docInserted);
    } catch (ex) {
      res.status(500).json({ "msg": "Error" });
    }
  }
);

router.put(
  "/evaluar/",
  async (req, res)=>{
    try{
      const {id} = req.params;
      const {keyword} = req.body;
      let result = await addKeyword(id, keyword);
      res.status(200).json(result);
    }catch(ex){
      res.status(500).json({ "msg": "Error" });
    }
  }
);

router.put(
  "/capturar_tickets",
  async (req, res) => {
    try {
      const { id } = req.params;
      const { keywords } = req.body;
      let result = await addKeywords(id, keywords);
      res.status(200).json(result);
    } catch (ex) {
      res.status(500).json({ "msg": "Error" });
    }
  }
);


module.exports = router;