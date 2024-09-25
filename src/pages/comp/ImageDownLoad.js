import RNFetchBlob from "rn-fetch-blob";
const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ?
             /[^.]+$/.exec(filename) : undefined;
  };
  const downloadImage = (data) => {
    // Main function to download the image
    console.log(data)
    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = data;    
    // Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' + 
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
       
       
        console.warn('Image Downloaded Successfully.');
      });
  };
  export const btnImage=(data)=>  {
    Alert.alert(
      "Download Image",'',
      [
        {text: 'NO', onPress: () => console.warn('Canceled'), style: 'cancel'},
        {text: 'YES', onPress: () => downloadImage(data)},
      ]
    );
  }
  import { openCamera , selectImage } from "./ImageModel";
  import { Alert } from "react-native";
  export const imageSelectBox=(data)=>  {
    Alert.alert(
      "Select Image",'',
      [
        {text: 'NO', onPress: () => console.warn('Canceled'), style: 'cancel'},
        {text: 'Camera', onPress: () => openCamera(data)},
        {text: 'Gallery', onPress: () => selectImage(data)},
      ]
    );
  }