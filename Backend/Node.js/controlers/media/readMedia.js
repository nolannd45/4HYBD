import Media from "../../models/media.js";

  export async function readMedia (req, res)  {
    try 
    {
        const medias = await Media.find({});
        res.status(200).send(medias);    
    } catch (error) 
    {
      console.log(error);
      res.sendStatus(500);
    }
  }

  export async function readStory(req, res) {
    try {
        const medias = await Media.find({ story: true });
        res.status(200).send(medias);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
  }
  export async function readMediaByGroupId(req, res) {
    try {
        const { groupId } = req.params;
        const medias = await Media.find({ receiver: groupId });
        console.log(medias)
        res.status(200).send(medias);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
  }
  
  export async function readMediaById (req, res)  {
    try 
    {
        const medias = await Media.findById(req.params.id);
        res.status(200).send(medias);    
    } catch (error) 
    {
      console.log(error);
      res.sendStatus(500);
    }
  };
  
