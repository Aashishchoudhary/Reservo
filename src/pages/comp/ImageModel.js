
import { launchCamera , launchImageLibrary } from 'react-native-image-picker';

    export const selectImage = (setUseState) => {
        const options = {
          mediaType: 'photo',
          quality: 0.1,
        };
      
       launchImageLibrary(options, (response) => {
          if (response.didCancel) {
            console.warn('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else {
            let imageUri = response.uri || response.assets?.[0]?.uri;
            const imageFile = {
              uri: imageUri,
              type: 'image/jpeg', // Change the type as needed based on the selected file
              name: 'image.jpg', // Change the name as needed based on the selected file
            };
            setUseState(imageFile);
          }
        });
      };
      
      
      
export     const openCamera =async (setUseState) => {
        const options = {
          mediaType: 'photo',
          quality: 0.1,
        };
      
       await launchCamera(options, (response) => {
          if (response.didCancel) {
            console.warn('User cancelled camera');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else { 
            let imageUri = response.uri || response.assets?.[0]?.uri;
            
            const imageFile = {
              uri: imageUri,
              type: 'image/jpeg', // Change the type as needed based on the selected file
              name: 'image.jpg', // Change the name as needed based on the selected file
            };
            setUseState(imageFile);
            
            
          }
        });
      }
      
     export function yyyymmdd(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
    
        const fullDate = `${year}-${month}-${day}`;
        return fullDate;
      }
    