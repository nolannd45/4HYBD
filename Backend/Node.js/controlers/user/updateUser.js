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
export async function addFriend(req, res) {
  try {
    console.log(req.body);
    const { friendId } = req.body;

    // Récupérez l'utilisateur courant
    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(404).send('Utilisateur non trouvé');
    }

    // Vérifiez si l'ami est déjà dans la liste
    if (currentUser.listFriends.includes(friendId)) {
      return res.status(400).send('Cet utilisateur est déjà votre ami');
    }

    // Ajoutez l'ID de l'ami à la liste
    currentUser.listFriends.push(friendId);

    // Sauvegardez l'utilisateur mis à jour
    await currentUser.save();

    res.status(200).send(currentUser);
  } catch (error) {
    console.error("Erreur du serveur:", error);
    res.status(500).send('Erreur du serveur');
  }
}

export default updateUser;