import {View, StyleSheet} from 'react-native';

import QRCode from 'react-native-qrcode-svg';
const QR = ({route}) => {
  const {data} = route.params;
  return (
    <View style={styles.container}>
      <QRCode styles={styles.qr} size={380} value={data} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make container take up entire screen height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  qr: {
    // Adjust the following properties as needed
    width: 1000, // Set desired width
    height: 1000, // Set desired height
    backgroundColor: '#fff', // Set background color
  },
});

export default QR;
