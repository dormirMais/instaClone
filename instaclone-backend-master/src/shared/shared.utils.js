import AWS from "aws-sdk";

export const uploadToS3 = async (file, userId, folderName) => {
  AWS.config.update({
    credentials: {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
    },
  });
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  console.log(objectName);
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: "instaclone-uploads-hakiii",
      Key: objectName,
      ACL: "public-read",
      Body: readStream,
    })
    .promise();
  return Location;
};
