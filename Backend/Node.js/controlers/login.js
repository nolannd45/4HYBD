import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const login = async (req, res) => {
  console.log("test")
  try 
  {
    const { pseudo, password } = req.body;

    if (!pseudo || !password) 
    {
      return res.status(400).send('En attente de votre nom d\'utilisateur ainsi que de votre mot de passe');
    }

    const user = await User.findOne({ pseudo });
    if (!user) 
    {
      return res.status(400).send('Utilisateur inexistant');
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) 
    {
      return res.status(400).send('Mot de passe incorrect');
    }

    const token = jwt.sign({
      id: user._id,
      pseudo: user.pseudo,
      private: user.private
    }, 'config', { expiresIn: '1d' });
    res.cookie('webtoken', token);


    res.status(200).json({
      token,
      user
    });
    
    
  } catch (error) 
  {
    console.log(error);
    res.sendStatus(500);
  }
};

export default login;