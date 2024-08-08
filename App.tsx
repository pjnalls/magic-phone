import { DeviceMotion } from 'expo-sensors';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, useColorScheme } from 'react-native';

export default function App() {
  const [quote, setQuote] = useState('');
  const colorScheme = useColorScheme();

  const getQuote = async () => {
    try {
      const response = await fetch('https://zenquotes.io/api/random');
      const json = await response.json();
      setQuote(json[0]?.q);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const subscription = DeviceMotion.addListener((data) => {
      const { x, y, z } = data.acceleration as {
        x: number;
        y: number;
        z: number;
      };
      const acceleration = Math.sqrt(x * x + y * y + z * z);

      // Adjust the threshold as needed
      if (acceleration > 50) {
        getQuote();
        setInterval(() => {setQuote('Shake your phone for a Zen quote.')}, 10000)
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('./assets/zen-garden.jpg')}
        resizeMode="cover"
      />
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: colorScheme == 'dark' ? '#000' : '#fff',
            opacity: colorScheme == 'dark' ? 0.5 : 0.8,
          },
        ]}
      ></View>
      <View style={styles.textContainer}>
        <Text
          style={{
            color: colorScheme == 'dark' ? '#fff' : '#000',
            fontSize: 24,
            padding: 2,
          }}
        >
          {quote ? quote : 'Shake your phone for a Zen quote.'}
        </Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    position: 'absolute',
    height: '100%',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
