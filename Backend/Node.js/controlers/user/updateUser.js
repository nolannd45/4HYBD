import User from "../../models/user.js";
import bcrypt from "bcrypt";

const updateUser = async (req, res) => {
  if (req.params.id == req.user.id){
    const { email, pseudo, password } = req.body;

      const saltRounds = 10;

      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        email,
        pseudo,
        password: bcrypt.hashSync(password, saltRounds)
      });
      res.status(200).send(updatedUser);
    
  }
  else{
    res.status(403).send('Vous ne disposez pas des droits pour modifier cette personne');
  }

};
  export default updateUser;