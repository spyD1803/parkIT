/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Heading from '../components/heading';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import Axios from 'axios';

const Ticket = props => {
  const {ticket} = props.route.params;
  const [isCancelLoading, setIscancel] = useState(false);
  const [isextendingLoading, setIsextending] = useState(false);
  const [spots, setSpots] = useState([]);
  const data = [...Array(20).keys()].map((y, index) => ({
    bookedBy: '',
    for: '',
    from: '',
    bookedAt: '',
    on: '',
    id: ticket.spotName + index,
  }));

  const onCancelPressed = async () => {
    const {ticket} = props.route.params;
    const newData = spots.map(spot => {
      if (spot.id == ticket.spotId) {
        return {
          ...spot,
          bookedBy: '',
          for: '',
          from: '',
          on: '',
          bookedAt: '',
        };
      }
      return spot;
    });
    setIscancel(true);

    Axios.post(
      'https://us-central1-parkit-c0ffc.cloudfunctions.net/bookingCanceled',
      {
        bookedBy: ticket.bookedBy,
        from: ticket.from,
        for: ticket.for,
        on: ticket.on,
        spot: ticket.spot,
      },
    );

    await firestore()
      .collection('spots')
      .doc(ticket.spotName)
      .update({
        spots: newData,
      })
      .then(function() {
        Snackbar.show({
          text: 'Cancelled Successfully',
          duration: Snackbar.LENGTH_SHORT,
        });
        console.log('Document successfully updated!');
      })
      .catch(function(error) {
        // The document probably doesn't exist.

        console.error('Error updating document: ', error);
      });

    const updated = await firestore()
      .collection('bookings')
      .doc(ticket.id)
      .update({
        status: 'cancelled',
      });
    props.navigation.goBack();
    setIscancel(false);
  };

  const getUserData = async () => {
    const {ticket} = props.route.params;

    const documentSnapshot = await firestore()
      .collection('spots')
      .doc(ticket.spotName)
      .get();

    setSpots(documentSnapshot.data().spots);
    // setSpots(JSON.parse(documentSnapshot.data().spots));
    // setUsers(documentSnapshot[0].data());
    // documentSnapshot.forEach(doc => {
    //   setSpots([...spots, ...doc.data()]);
    // });
    // setUsers(documentSnapshot.docs);
  };

  useEffect(() => {
    getUserData();
  }, []);

  const onExtendPressed = async () => {
    setIsextending(true);
    const {ticket} = props.route.params;
    const newData = spots.map(spot => {
      if (spot.id == ticket.spotId) {
        return {
          ...spot,
          bookedBy: ticket.bookedBy,
          from: ticket.from,
          bookedAt: ticket.bookedAt,
          on: ticket.on,
          for: String(Number(ticket.for) + 1),
        };
      }
      return spot;
    });

    Axios.post(
      'https://us-central1-parkit-c0ffc.cloudfunctions.net/bookingExtended',
      {
        bookedBy: ticket.bookedBy,
        from: ticket.from,
        for: String(Number(ticket.for) + 1),
        on: ticket.on,
        spot: ticket.spot,
      },
    );

    await firestore()
      .collection('spots')
      .doc(ticket.spotName)
      .update({
        spots: newData,
      })
      .then(async function() {
        await firestore()
          .collection('bookings')
          .doc(ticket.id)
          .update({
            for: String(Number(ticket.for) + 1),
          });
        setIsextending(false);
        Snackbar.show({
          text: 'Booking Extended',
          duration: Snackbar.LENGTH_SHORT,
        });
        props.navigation.goBack();
        console.log('Document successfully updated!');
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        setIsextending(false);
        Snackbar.show({
          text: 'Booking Extension unsuccessful',
          duration: Snackbar.LENGTH_SHORT,
        });
        console.error('Error updating document: ', error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Heading>Ticket</Heading>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{flex: 1, justifyContent: 'center'}}>
        <View style={{alignItems: 'center', marginVertical: 16}}>
          <QRCode
            // eslint-disable-next-line prettier/prettier
            value={`${ticket.bookedBy}-${ticket.vehicleNumber}-${ticket.on}-${ticket.from}-${ticket.spot}`}
            size={150}
            backgroundColor={'gray'}
          />
        </View>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              marginBottom: 16,
              color: '#000',
            }}>
            {ticket.spot}
          </Text>
          <Text style={{fontWeight: 'bold', fontSize: 18, color: '#eee'}}>
            {moment(ticket.on).format('MMM DD, YYYY')}
          </Text>
          <Text style={{fontWeight: 'bold', fontSize: 18, color: '#eee'}}>
            {moment(ticket.from).format('h:mm a')} -
            {moment(ticket.from)
              .add(Number(ticket.for), 'hours')
              .format('h:mm a')}
            {/* From : {ticket.from} */}
          </Text>
          {/* <Text style={{fontWeight: 'bold', fontSize: 18, color: '#aaa'}}>
            For : {ticket.for} {ticket.for == '1' ? 'hr' : 'hrs'}
          </Text> */}
        </View>

        <TouchableOpacity
          style={{
            padding: 16,
            margin: 16,
            marginTop: 120,
            backgroundColor: '#FDD835',
            alignItems: 'center',
            borderRadius: 8,
          }}
          onPress={onExtendPressed}>
          {isextendingLoading ? (
            <ActivityIndicator color={'#fff'} />
          ) : (
            <Text style={{color: '#000'}}>Extend by an hour</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 16,
            margin: 16,
            borderColor: '#FDD835',
            borderWidth: 1,
            alignItems: 'center',
            borderRadius: 8,
          }}
          onPress={onCancelPressed}>
          {isCancelLoading ? (
            <ActivityIndicator color={'#FDD835'} />
          ) : (
            <Text style={{color: '#FDD835'}}>Cancel</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
});

export default Ticket;
