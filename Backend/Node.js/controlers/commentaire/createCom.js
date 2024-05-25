import Commentaire from "../../models/commentaire.js";
import * as yup from "yup";

const createCom = async (req, res) => {
    const schema = yup.object().shape({
      receiver: yup.string().required(),
      content: yup.string().required()
    });

    const isValid = await schema.isValid(req.body);
    
    try {
        if (isValid) {
            const { sender, receiver, content } = req.body;

            const newMessage = new Commentaire({
                sender,
                receiver,
                content
            });

            const savedMessage = await newMessage.save();
            res.status(201).send(savedMessage);
        } else {
            res.status(400).send('Invalid input data');
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

export default createCom;
