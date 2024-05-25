import commentaire from "../../models/commentaire.js";

  export async function readCom (req, res)  {
    try 
    {
        const coms = await commentaire.find({});
        res.status(200).send(coms);    
    } catch (error) 
    {
      console.log(error);
      res.sendStatus(500);
    }
  }
  
  export async function readComById (req, res)  {
    try 
    {
        const coms = await commentaire.findById(req.params.id);
        res.status(200).send(coms);    
    } catch (error) 
    {
      console.log(error);
      res.sendStatus(500);
    }
  }
  
  export async function getComs(req, res) {
    const { userId, friendId } = req.params;
    try {
        const messages = await commentaire.find({
            $or: [
                { sender: userId, receiver: friendId },
                { sender: friendId, receiver: userId }
            ]
        }).sort({ timestamp: 1 });
        res.status(200).send(messages);
    } catch (error) {
        res.status(400).send(error);
    }
};
  
