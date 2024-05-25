import User from "../../models/user.js";
import * as yup from "yup";
import bcrypt from "bcrypt";

const deleteUser = async (req, res) => {
    if (req.params.id == req.user.id){
      const removed = await User.findByIdAndDelete(req.params.id);
      if (!removed) {
        res.sendStatus(404);
        return;
      }
      res.status(200).send(removed);
    }
    else{
      res.status(403).send('Vous ne disposez pas des droits pour modifier cette personne');
    }

};
  export default deleteUser;