import group from "../../models/group.js";


  export async function getComs(req, res) {
    const { groupId } = req.params;

    try {
        const messages = await group.findById(groupId).sort({ timestamp: 1 });
        res.status(200).send(messages);
    } catch (error) {
        res.status(400).send(error);
    }
};
  
