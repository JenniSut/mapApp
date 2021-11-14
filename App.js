import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';


export default function App() {

  const [input, setInput] = useState('');
  const [region, setRegion] = useState({
    latitude: 60.200692, 
    longitude: 24.934302, 
    latitudeDelta: 0.0422, 
    longitudeDelta: 0.0221,});
  const [coordinate, setCoordinate] = useState({ latitude: region.latitude, longitude: region.longitude })
  const [api, setApi] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {getLocation()}, []);
  useEffect(() => {setCoordinate({ latitude: region.latitude, longitude: region.longitude } )}, [region]);

  const getLocation = async() =>{
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('no permission to get location')
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location)
    console.log(location.coords.latitude)
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0022,
      longitudeDelta: 0.0221,
    });
    
  }

  const getMap = () => {

    let key = input.replace(/\s+/g, '');
    fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=QHllj8TueiNQZxPxioSLPTfbEATpyXpx&location=${key}`)
      .then(response => response.json())
      .then(responseJson => setRegion({ 
        latitude: responseJson.results[0].locations[0].displayLatLng.lat, 
        longitude: responseJson.results[0].locations[0].displayLatLng.lng,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,}), 
        )
      
      .catch(error => {
        Alert.alert('error', error.message)
      });
    
      
  }


  return (
    
    <View style={{ flex: 1 }}>
    <MapView
      style= {{height: '90%'}}
      region={region}
        >
        <Marker
        coordinate=
        {coordinate}
          title='Your spot'/>
      </MapView>
      <TextInput style={{
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1}}
        onChangeText={input => setInput(input)} value={input}></TextInput>
        <Button style={{width: '100%'}} title='Find' onPress={getMap}/>
    </View>
    
  );
      }


