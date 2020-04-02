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
import {StackActions} from '@react-navigation/native';
import Axios from 'axios';

const Signup = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, seterror] = useState('');
  const {container, borderContainer} = styles;

  // useEffect(() => {
  //   async function getData() {
  //     try {
  //       const value = await AsyncStorage.getItem('user');
  //       if (value !== null) {
  //         props.navigation.navigate('Home', {
  //           name: JSON.parse(value)['name'],
  //           email: JSON.parse(value)['email'],
  //         });
  //         // value previously s
  //       }
  //     } catch (e) {
  //       // error reading value
  //     }
  //   }
  //   getData();
  //   return () => {};
  // }, [props.navigation]);

  const onSIgninPressed = async () => {
    setIsLoading(true);

    const code = Math.floor(100000 + Math.random() * 900000);

    await Axios.post(
      'https://us-central1-parkit-c0ffc.cloudfunctions.net/verificationCode',
      {
        email,
        code,
      },
    );

    props.navigation.dispatch(
      StackActions.replace('verify', {
        name,
        email,
        password,
        code,
      }),
    );

    // when submit is pressed add the email, first name and password to the collection
    // const documentSnapshot = await firestore()
    //   .collection('users')
    //   .add({
    //     name,
    //     email,
    //     password,
    //     drivingLicence: '',
    //     drivingLicenceImg: '',
    //   });

    // // After adding to the collection navigate to login screen for the user to login
    // if (documentSnapshot) {
    //   Snackbar.show({
    //     text: 'Account created successfully. Log In',
    //     duration: Snackbar.LENGTH_SHORT,
    //   });
    //   props.navigation.navigate('login');
    // } else {
    //   seterror('No Account exists with the email');
    // }
    // setPasswoinrd('No registered email');
    setIsLoading(false);
  };

  return (
    <ImageBackground
      source={require('../bg.jpeg')}
      style={{height: '100%', width: '100%'}}>
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
        <Text>{error}</Text>
        <Text
          style={{
            marginHorizontal: 16,
            marginBottom: 16,
            fontWeight: 'bold',
            color: '#fff',
          }}>
          Name
        </Text>
        {/* Input for name */}
        <View style={borderContainer}>
          <TextInput
            value={name}
            onChangeText={name => setName(name)}
            style={{color: '#fff'}}
          />
        </View>
        <Text
          style={{
            marginHorizontal: 16,
            marginBottom: 16,
            fontWeight: 'bold',
            color: '#fff',
          }}>
          Email
        </Text>
        {/* Input for email */}
        <View style={borderContainer}>
          <TextInput
            value={email}
            onChangeText={email => setEmail(email)}
            style={{color: '#fff'}}
          />
        </View>
        <Text
          style={{
            marginHorizontal: 16,
            marginBottom: 16,
            fontWeight: 'bold',
            color: '#fff',
          }}>
          Password
        </Text>
        {/* Input for password */}
        <View style={borderContainer}>
          <TextInput
            value={password}
            onChangeText={password => setPassword(password)}
            style={{color: '#fff'}}
          />
        </View>
        <TouchableOpacity
          onPress={onSIgninPressed}
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
            <Text style={{color: '#000'}}>Sign Up</Text>
          )}
        </TouchableOpacity>
        {/* If the user has an acount navigate back to login */}
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Text style={{textAlign: 'center', color: '#fff'}}>
            Already have an Account ? &nbsp;
            <Text
              style={{
                textAlign: 'center',
                textDecorationLine: 'underline',
                padding: 8,
                fontSize: 16,
                color: '#fff',
              }}>
              Log In
            </Text>
          </Text>
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

export default Signup;
