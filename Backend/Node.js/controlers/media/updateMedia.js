import Media from "../../models/media.js";


async function updateMedia (req, res) {

      const { tit, des } = req.body;
      const user = req.user
      

      const doc = await Media.findById(req.params.id)
      console.log(user.id)
      console.log(doc)
      console.log(doc.titre)
      console.log(doc.user)
      if (doc.user == user.id){
        doc.titre = tit
        doc.desc = des

        await doc.save();
        res.status(200).send(doc);
      }else{
        res.status(400).send("seul le créateur peut modifier son image");
      }
      
};

export default updateMedia;
