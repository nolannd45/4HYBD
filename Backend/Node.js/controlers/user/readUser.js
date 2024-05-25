import User from "../../models/user.js";

  export async function readUser (req, res)  {
    try 
    {
        const users = await User.find({});
        res.status(200).send(users);    
    } catch (error) 
    {
      console.log(error);
      res.sendStatus(500);
    }
  };

  export async function readUserById (req, res)  {
    try 
    {
        const users = await User.findById(req.params.id);
        console.log(users)
        res.status(200).send(users);    
    } catch (error) 
    {
      console.log(error);
      res.sendStatus(500);
    }
  };
  
