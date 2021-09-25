import { Storage } from '@google-cloud/storage';
const storage = new Storage();

const storageFunc = (event: any) => {
  if (!event.name.includes('.temp-beam') && !event.name.includes('avro')) {
    const bucketName: string = event.bucket;
    const bucket = storage.bucket(bucketName);
    const remoteFile = bucket.file(event.name);
    console.log('Reading File');
    const archivo = remoteFile.createReadStream();

    console.log('Concat Data');
    let buf = '';
    archivo
      .on('data', (d) => {
        console.log('data', d);
        const jsob = Buffer.from(d, 'base64').toString();
        const jsobs = Buffer.from(d, 'base64');
        // const jsob1 = Buffer.from(JSON.parse(d), "base64");
        // eslint-disable-next-line no-console
        console.log('jsob', jsob);
        console.log('jsobs', jsobs);
        // console.log("jsob1", jsob1);
        buf += d;
      })
      .on('end', () => {
        console.log('buf', buf);
        console.log('End');
      });
  }
  // console.log("context", context);
};

export { storageFunc };
