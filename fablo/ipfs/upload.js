import { create } from 'ipfs-http-client';
import { auth } from './infura-config';

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: { authorization: auth },
});

export const uploadFileToIPFS = async (file) => {
  const added = await client.add(file);
  return `https://ipfs.io/ipfs/${added.path}`;
};
