import Media from "../../models/media.js";

const delMedia = async (req, res) => {
  try 
  {
      const deleted = await Media.findByIdAndDelete(req.params.id);
      if (!deleted) 
      {
        res.sendStatus(404);
        return;
      }
      res.status(200).send(deleted);
  
  } catch (error) 
  {
    console.log(req.params.id)
    if (error.kind && error.kind === "ObjectId") 
    {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(500);
    console.log(error);
  }
};
export default delMedia;