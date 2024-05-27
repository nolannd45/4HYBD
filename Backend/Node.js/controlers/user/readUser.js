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

  export async function readUserByPseudo (req, res)  {
    try 
    {
        const query = req.query.q;
        const users = await User.find({ pseudo: new RegExp(query, 'i') });
        console.log(users)
        res.status(200).send(users);    
    } catch (error) 
    {
      console.log(error);
      res.sendStatus(500);
    }

    
  };
  
