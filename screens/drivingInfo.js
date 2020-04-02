/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Picker,
  ActivityIndicator,
} from 'react-native';
import Heading from '../components/heading';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';

const BookingInfo = props => {
  const [licenceNumber, setLicenceNumber] = useState();
  const [image, setImage] = useState('');
  const [imageName, setImageName] = useState('');
  const [response, setResponse] = useState('');
  const [downloadableUrl, seturl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(true);

  const app = storage();
  const getUserData = async () => {
    // const documentSnapshot = await firestore()
    //   .collection('spots')
    //   .doc(props.route.params.spotName)
    //   .get();
    // setSpots(documentSnapshot.data().spots);
    // setSpots(JSON.parse(documentSnapshot.data().spots));
    // setUsers(documentSnapshot[0].data());
    // documentSnapshot.forEach(doc => {
    //   setSpots([...spots, ...doc.data()]);
    // });
    // setUsers(documentSnapshot.docs);
    // var gsReference = storage().refFromURL(
    //   'gs://parkit-c0ffc.appspot.com/driversInfo',
    // );
    // const userDriverseLicenseImage = gsReference.getDownloadURL();
    // userDriverseLicenseImage.then(url => seturl(url));
  };

  const uploadDrivingLicenceTapped = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {skipBackup: true},
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);
      setResponse(response);
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};
        // You can also display the image using data:
        // let source = { uri: "data:image/jpeg;base64," + response.data };
        // this.setState({
        //   avatarSource: response.uri,
        //   imageuri: response.uri,
        //   imagename: response.fileName,
        // });
        setImage(response.uri);
        setImageName(response.fileName);
      }
    });
  };

  useEffect(() => {
    getUserData();
  }, []);

  const saveInfo = async () => {
    setUploading(true);
    const fileName = `${props.route.params.email}-${licenceNumber}`;
    storage()
      .ref()
      .child(fileName)
      .putFile(image)
      .then(response => {
        var gsReference = storage().refFromURL(
          `gs://parkit-c0ffc.appspot.com/${fileName}`,
        );

        const userDriverseLicenseImage = gsReference.getDownloadURL();
        userDriverseLicenseImage.then(async url => {
          seturl(url);
          setImage('');
          await firestore()
            .collection('users')
            .doc(props.route.params.id)
            .update({
              drivingLicence: licenceNumber,
              drivingLicenceImg: url,
            })
            .then(async function() {
              const userString = await AsyncStorage.getItem('user');
              const user = JSON.parse(userString);
              await AsyncStorage.setItem(
                'user',
                JSON.stringify({
                  ...user,
                  drivingLicence: licenceNumber,
                  drivingLicenceImg: url,
                }),
              );

              setUploading(false);
              Snackbar.show({
                text: 'UPloaded Successfully',
                duration: Snackbar.LENGTH_SHORT,
              });
              props.navigation.goBack();
              console.log('Document successfully updated!');
            })
            .catch(function(error) {
              // The document probably doesn't exist.

              console.error('Error updating document: ', error);
            });
        });
        // seturl1(response);
        // seturl(response['metadata']);
        // return response.ref.getDownloadURL();
      })
      .then(photoUrl => seturl(photoUrl));
  };
  const {container} = styles;
  return (
    <SafeAreaView style={container}>
      {/* <Text>{JSON.stringify(props.route)}</Text> */}
      {/* {downloadableUrl && (
          <Image
            source={{uri: downloadableUrl}}
            style={{width: '100%', height: 200}}
          />
        )} */}

      {props.route.params.drivingLicence &&
      props.route.params.drivingLicenceImg &&
      dataAvailable ? (
        <ScrollView style={{flex: 1}} contentContainerStyle={{flex: 1}}>
          <Heading>User Details</Heading>
          <View style={{marginHorizontal: 16}}>
            <Image
              style={{width: '100%', height: 200}}
              source={{uri: props.route.params.drivingLicenceImg}}
            />
            <TouchableOpacity
              style={{
                padding: 16,
                marginTop: 16,
                backgroundColor: '#FDD835',
                alignItems: 'center',
                borderRadius: 8,
              }}
              onPress={() => {
                setDataAvailable(false);
              }}>
              {uploading ? (
                <ActivityIndicator color={'#000'} />
              ) : (
                <Text style={{color: '#000'}}>Save Again</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={{flex: 1}} contentContainerStyle={{flex: 1}}>
          <Heading>User Details</Heading>
          {/* <Text>{JSON.stringify(downloadableUrl)}</Text> */}
          {/* <Text>2{JSON.stringify(downloadableUrl1)}</Text> */}
          <View style={{flex: 1}}>
            <Text
              style={{
                marginHorizontal: 16,
                marginBottom: 16,
                fontWeight: 'bold',
              }}>
              Driving License Number
            </Text>
            <View style={styles.borderContainer}>
              <TextInput
                value={licenceNumber}
                style={{width: '100%'}}
                onChangeText={licenceNumber => setLicenceNumber(licenceNumber)}
              />
            </View>

            {image.length > 0 && imageName.length > 0 && (
              <Image
                style={{
                  width: '100%',
                  height: 200,
                }}
                resizeMode={'contain'}
                source={{uri: image}}
              />
            )}

            {!uploading && (
              <TouchableOpacity
                style={{
                  padding: 16,
                  margin: 16,
                  borderColor: '#FDD835',
                  borderWidth: 1,
                  alignItems: 'center',
                  borderRadius: 8,
                }}
                onPress={() => {
                  uploadDrivingLicenceTapped();
                }}>
                <Text style={{color: '#FDD835'}}>Upload Driving Licence</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={{
              padding: 16,
              margin: 16,
              backgroundColor: '#FDD835',
              alignItems: 'center',
              borderRadius: 8,
            }}
            onPress={() => {
              saveInfo();
            }}>
            {uploading ? (
              <ActivityIndicator color={'#000'} />
            ) : (
              <Text style={{color: '#000'}}>Book</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray',
    flex: 1,
  },

  spotName: {
    fontSize: 20,
    marginHorizontal: 32,
    marginBottom: 16,
  },
  borderContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    marginHorizontal: 16,
  },
});

export default BookingInfo;
