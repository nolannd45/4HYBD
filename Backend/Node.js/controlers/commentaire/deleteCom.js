import commentaire from "../../models/commentaire";

const deleteCom = async (req, res) => {
    const removed = await commentaire.findByIdAndDelete(req.params.id);
    if (!removed) {
      res.sendStatus(404);
      return;
    }
    res.status(200).send(removed);
    

};
  export default deleteCom;