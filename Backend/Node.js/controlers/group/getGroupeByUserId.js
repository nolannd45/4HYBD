import group from "../../models/group.js";


  export async function getGroupeByUserId(req, res) {
    const { userId } = req.params;

    try {
        const messages = await group.find({users:userId}).sort({ timestamp: 1 });
        res.status(200).send(messages);
    } catch (error) {
        res.status(400).send(error);
    }
};
