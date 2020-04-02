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

const Login = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, seterror] = useState('');
  const {container, borderContainer} = styles;

  useEffect(() => {
    async function getData() {
      Snackbar;
      try {
        const value = await AsyncStorage.getItem('user');
        // seterror(value);
        if (value !== null) {
          props.navigation.navigate('Home', {
            name: JSON.parse(value)['name'],
            email: JSON.parse(value)['email'],
            id: JSON.parse(value)['id'],
            ...JSON.parse(value),
          });
          // value previously s
        }
      } catch (e) {
        // error reading value
      }
    }
    getData();
    return () => {};
  }, [props.navigation]);

  const onLoginPressed = async () => {
    // set loading to true
    setIsLoading(true);

    // Get the list of users from firebase

    const documentSnapshot = await firestore()
      .collection('users')
      .get();
    // await documentSnapshot
    //   .where('email', '==', email)
    //   .limit(1)
    //   .onSnapshot(Loaddata);

    /**
     * Check whether the user entered data is presenet in the table
     *  If yes navigate yo yhe home screen
     * */

    documentSnapshot.forEach(async doc => {
      seterror(doc.data());
      if (doc.data()['email'] == email && doc.data()['password'] == password) {
        // seterror(doc.data());
        await AsyncStorage.setItem(
          'user',
          JSON.stringify({...doc.data(), id: doc.id}),
        );
        // seterror(JSON.stringify({...doc.data(), id: doc.id}));
        props.navigation.navigate('Home', {
          name: doc.data()['name'],
          email: doc.data()['email'],
          id: doc.id,
          ...doc.data(),
        });
      }
    });

    //set loading to false
    setIsLoading(false);
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
        <Text>{JSON.stringify(error)}</Text>
        <Text
          style={{
            marginHorizontal: 16,
            marginBottom: 16,
            fontWeight: 'bold',
            color: '#fff',
          }}>
          Email
        </Text>

        {/* Input for mail */}
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
          onPress={onLoginPressed}
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
            <Text style={{color: '#000'}}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('signup');
          }}>
          <Text style={{textAlign: 'center', color: '#fff'}}>
            Don't have an Account ? &nbsp;
            <Text
              style={{
                textAlign: 'center',
                textDecorationLine: 'underline',
                padding: 8,
                fontSize: 16,
                color: '#fff',
              }}>
              Sign Up
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

export default Login;
