import Group from "../../models/group.js";
import * as yup from "yup";

const createGroup = async (req, res) => {
    const schema = yup.object().shape({
      titre: yup.string().required(),
      users: yup.array()
    });

    const isValid = await schema.isValid(req.body);
    
    try {
        if (isValid) {
            const { titre, users } = req.body;

            const newGroup = new Group({
                titre,
                users
            });

            const savedGroup = await newGroup.save();
            res.status(201).send(savedGroup);
        } else {
            res.status(400).send('Invalid input data');
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

export default createGroup;
