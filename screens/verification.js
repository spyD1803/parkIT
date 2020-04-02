/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import Snackbar from 'react-native-snackbar';

const Verification = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const [error, seterror] = useState('');
  const {container, borderContainer} = styles;

  const onVerifyPressed = async () => {
    // set loading to true
    setIsLoading(true);

    const {name, email, password} = props.route.params;

    if (code == props.route.params.code) {
      const documentSnapshot = await firestore()
        .collection('users')
        .add({
          name: name,
          email,
          password,
          drivingLicence: '',
          drivingLicenceImg: '',
        });

      // After adding to the collection navigate to login screen for the user to login
      if (documentSnapshot) {
        Snackbar.show({
          text: 'Account created successfully. Log In',
          duration: Snackbar.LENGTH_SHORT,
        });
        props.navigation.navigate('login');
      } else {
        seterror('No Account exists with the email');
      }
      setIsLoading(false);
    } else {
      Snackbar.show({
        text: 'Enter valid code',
        duration: Snackbar.LENGTH_SHORT,
      });
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../bg.jpeg')}
      style={{width: '100%', height: '100%'}}>
      <SafeAreaView style={container}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 32,
            textAlign: 'center',
            marginVertical: 32,
            fontStyle: 'italic',
            color: '#fff',
          }}>
          ParkIT
        </Text>
        {/* <Text>{JSON.stringify(JSON.stringify(props))}</Text> */}
        <Text style={{color: '#fff', margin: 16}}>
          We sent a verification code to your email. Please enter it to finish
          the signup process.
        </Text>
        <Text
          style={{
            marginHorizontal: 16,
            marginBottom: 16,
            fontWeight: 'bold',
            color: '#fff',
          }}>
          Verification Code
        </Text>

        {/* Input for mail */}
        <View style={borderContainer}>
          <TextInput
            value={code}
            onChangeText={code => setCode(code)}
            style={{color: '#fff'}}
          />
        </View>

        <TouchableOpacity
          onPress={onVerifyPressed}
          style={{
            padding: 16,
            margin: 16,
            backgroundColor: '#fff',
            alignItems: 'center',
            borderRadius: 8,
            alignSelf: 'center',
            paddingHorizontal: 32,
          }}>
          {isLoading ? (
            <ActivityIndicator color={'#000'} />
          ) : (
            <Text style={{color: '#000'}}>Verify</Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  borderContainer: {
    borderColor: '#ddd',
    borderBottomWidth: 1,
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    marginHorizontal: 16,
  },
});

export default Verification;
