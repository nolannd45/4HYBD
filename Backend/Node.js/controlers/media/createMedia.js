import { BlobServiceClient } from '@azure/storage-blob';
import 'dotenv/config';
import { MongoClient } from "mongodb";
import Media from "../../models/media.js";

const mongodbUri = process.env.MONGODB_URI;
const accountName = process.env.ACCOUNT_NAME;
const sasToken = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;

const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`);
const containerClient = blobServiceClient.getContainerClient(containerName);

const client = new MongoClient(mongodbUri);
client.connect();

export async function getMediaStatus(req, res) {
  try {
      const { userId, friendId } = req.params;
      const medias = await Media.find({ receiver: userId, sender: friendId, vu: false });
      res.status(200).send(medias);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
}
export async function markMediaAsSeen(req, res) {
  try {
      const { mediaId } = req.params;
      const media = await Media.findById(mediaId);
      if (!media) {
          return res.status(404).send('Media not found');
      }

      media.vu = true;
      await media.save();
      res.status(200).send(media);
  } catch (error) {
      console.error(error);
      res.sendStatus(500);
  }
}

async function createMedia(req, res) {

  const file = req.files
  const sender = req.user
  const { receiver, story, latitude, longitude } = req.body
  let vu = false
  
  const blobName = req.files["image"].name
  
      if (!file) {
        return res.status(400).json({ error: "Veuillez fournir le chemin du fichier." });
      }

      const blobClient = containerClient.getBlockBlobClient(`${Date.now()}_${blobName}`);

      try{
        await blobClient.upload(file["image"].data, file["image"].size, {
        blobHTTPHeaders: {
            blobContentType: file["image"].mimetype
        }
      });
      res.end(JSON.stringify({ message: `Le fichier ${Date.now()}_${blobName} a été téléchargé avec succès sur Azure Blob Storage.`}));
      } catch (error){
        console.error('Error:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Erreur serveur ' }));
      }
      
      await storeMetadata(blobName, file["image"].mimetype, blobClient.url,receiver, sender.id,  JSON.parse(story), vu, latitude, longitude)

      } 

    async function storeMetadata(fileName, fileType, imageUrl, receiver,sender, story, vu, latitude, longitude) {
      const collection = client.db("test").collection('media');
      await collection.insertOne({ fileName, fileType, imageUrl,receiver,sender, story, vu, latitude, longitude });
  }


export default createMedia;