import ImageKit from 'imagekit';

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_3Cv7nDdS19aOSeTY88SAlJvpW0k=',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_JWDwiRxL0FA1c0KxsGs5pxy5ykg=',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/bc9nnctkf'
});
