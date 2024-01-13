import {Router} from 'express';
import {promises as fs} from 'fs';
import {Message} from '../types';
import crypto from 'crypto';

const messagesRouter = Router();
const path = './messages';
messagesRouter.get('/', async (req, res) => {
  const files = await fs.readdir(path);
  const recentFiles = files.slice(-5);
  
  const messages: Message[] = await Promise.all(
    recentFiles.map(async (file) => {
      const filePath = `${path}/${file}`;
      const content = await fs.readFile(filePath, 'utf-8');
      const message = JSON.parse(content);
      return {...message};
    })
  );
  res.send(messages);
})

messagesRouter.post('/', async (req, res) => {
  const id = crypto.randomUUID();
  const datetime = new Date().toISOString();
  const fileName = `${datetime}.txt`;
  const filePath = `${path}/${fileName}`;
  
  const message: Message = {
    id,
    message: req.body.message,
    datetime,
  };
  
  await fs.writeFile(filePath, JSON.stringify(message));
  res.send(message);
});

export default messagesRouter;