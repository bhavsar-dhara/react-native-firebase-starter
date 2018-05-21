import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, 
  AppRegistry,
  PixelRatio,
  TouchableOpacity } from 'react-native';

import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // firebase things?
      userCreds: {},
      uid: "",
      avatarSource: null,
      videoSource: null
    };
  }

  componentDidMount() {
    // firebase things?

    firebase.auth()
      .signInAnonymouslyAndRetrieveData()
      .then(credential => {
        if (credential) {
          console.log('default app user ->', credential.user.toJSON());

          this.setState({
            userCreds: credential.user,
            uid: credential.user.uid,
          });

          // TODO -> save user creds in SharedPrefs -> to upload files in uid folder

          console.log("uid === " + this.state.uid);
        }
      });


    const app = firebase.storage();
    // const app = firebase.storage();
    console.log("app === " + app.name);


    setTimeout(() => {
      console.log("timeout uid === " + this.state.uid);
      // this.uploadImg;

      // TODO -> Add image picker react-native library here to fetch the image URI

      // const uri = require('./assets/spring-awakening-3132112_1920.jpg');
      // console.log("uri === " + uri);
      // fetch(uri)
      //   .then(function(res) {
      //     console.log("fetch res")
      //     if (res.ok) {
      //       res.blob();
      //     }
      //   })
      //   .then(function(blob) {
      //     console.log("blob res");
      //     childRef
      //       .put(blob)
      //       .then(function(snapshot) {
      //         console.log('Uploaded a blob or file!');
              
      //         console.log("download url === " + childRef.getDownloadURL());
      //       })
      //       .catch(function(error) {
      //         console.error('Upload Error');
      //       });
      //   })
      //   .catch(function(error) {
      //     console.error('Error while fetching or blobing...' + error);
      //   })
    }, 2000);

    


    // download file - test
    const ref = app.ref('/nature-3184889_1920.jpg');
    console.log("path === " + ref.name);

    ref.getDownloadURL().then(function(url) {
      // Insert url into an <img> tag to "download"

      console.log("SUCCESS..........!!!!!!!");
    }).catch(function(error) {

      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object_not_found':
          console.error("File doesn't exist");
          break;

        case 'storage/unauthorized':
          console.error("User doesn't have permission to access the object");
          break;

        case 'storage/canceled':
          console.error("User canceled the upload");
          break;

          // ...

        case 'storage/unknown':
          console.error("Unknown error occurred, inspect the server response");
          break;
      }
    });
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      
      this.uploadImageStorage(response.uri);
      
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        });
      }
    });
  }

  uploadImageStorage(uri) {
    if (uri != null) {
      console.log("uri === " + uri);
      const _filePath = uri.replace('file://', '');
      console.log("filepath === " + _filePath);
      var _filename = _filePath.substring(_filePath.lastIndexOf('/')+1);

      // Create a root reference
      var storageRef = firebase.storage().ref();
      console.log("app ref === " + storageRef.fullPath);
      console.log("uid === " + this.state.uid);
      var childRef = storageRef.child(this.state.uid + "/images/" + _filename);
      console.log("childRef === " + childRef.fullPath);

      // TODO -> set file type as image/jpg -> or dynamically as per the image type being uploaded

      childRef
      .put(_filePath)
      .then(function(snapshot) {
        console.log('Uploaded a blob or file!');
        
        console.log("download url === " + childRef.getDownloadURL());
      })
      .catch(function(error) {
        console.error('Upload Error');
      });
    }
  }

  selectVideoTapped() {
    const options = {
      title: 'Video Picker',
      takePhotoButtonTitle: 'Take Video...',
      mediaType: 'video',
      videoQuality: 'medium'
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      this.uploadVideoStorage(response.uri);

      if (response.didCancel) {
        console.log('User cancelled video picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        this.setState({
          videoSource: response.uri
        });
      }
    });
  }

  uploadVideoStorage(uri) {
    if (uri != null) {
      console.log("uri === " + uri);
      const _filePath = uri.replace('file://', '');
      console.log("filepath === " + _filePath);
      var _filename = _filePath.substring(_filePath.lastIndexOf('/')+1);

      // Create a root reference
      var storageRef = firebase.storage().ref();
      console.log("app ref === " + storageRef.fullPath);
      console.log("uid === " + this.state.uid);
      var childRef = storageRef.child(this.state.uid + "/videos/" + _filename);
      console.log("childRef === " + childRef.fullPath);

      // TODO -> set file type dynamically as per the video type being uploaded

      childRef
      .putFile(_filePath)
      .then(function(snapshot) {
        console.log('Uploaded a blob or file!');
        
        console.log("download url === " + childRef.getDownloadURL());
      })
      .catch(function(error) {
        console.error('Upload Error');
      });
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
          { this.state.avatarSource === null ? <Text>Select a Photo</Text> :
            <Image style={styles.avatar} source={this.state.avatarSource} />
          }
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.selectVideoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer]}>
            <Text>Select a Video</Text>
          </View>
        </TouchableOpacity>

        { this.state.videoSource &&
          <Text style={{margin: 8, textAlign: 'center'}}>{this.state.videoSource}</Text>
        }

        {/* ^^^^^^^^^ added code ^^^^^^^^^  */}

        <Image source={require('./assets/RNFirebase.png')} style={[styles.logo]} />
        <Text style={styles.welcome}>
          Welcome to the React Native{'\n'}Firebase starter project!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        {Platform.OS === 'ios' ? (
          <Text style={styles.instructions}>
            Press Cmd+R to reload,{'\n'}
            Cmd+D or shake for dev menu
          </Text>
        ) : (
          <Text style={styles.instructions}>
            Double tap R on your keyboard to reload,{'\n'}
            Cmd+M or shake for dev menu
          </Text>
        )}
        <View style={styles.modules}>
          <Text style={styles.modulesHeader}>The following Firebase modules are enabled:</Text>
          {firebase.admob.nativeModuleExists && <Text style={styles.module}>Admob</Text>}
          {firebase.analytics.nativeModuleExists && <Text style={styles.module}>Analytics</Text>}
          {firebase.auth.nativeModuleExists && <Text style={styles.module}>Authentication</Text>}
          {firebase.crashlytics.nativeModuleExists && <Text style={styles.module}>Crashlytics</Text>}
          {firebase.firestore.nativeModuleExists && <Text style={styles.module}>Cloud Firestore</Text>}
          {firebase.messaging.nativeModuleExists && <Text style={styles.module}>Cloud Messaging</Text>}
          {firebase.links.nativeModuleExists && <Text style={styles.module}>Dynamic Links</Text>}
          {firebase.iid.nativeModuleExists && <Text style={styles.module}>Instance ID</Text>}
          {firebase.notifications.nativeModuleExists && <Text style={styles.module}>Notifications</Text>}
          {firebase.perf.nativeModuleExists && <Text style={styles.module}>Performance Monitoring</Text>}
          {firebase.database.nativeModuleExists && <Text style={styles.module}>Realtime Database</Text>}
          {firebase.config.nativeModuleExists && <Text style={styles.module}>Remote Config</Text>}
          {firebase.storage.nativeModuleExists && <Text style={styles.module}>Storage</Text>}
        </View>
        </View>    
      </ScrollView>
    );
  }

  uploadImg = async () => {
    console.log("in async");
    // upload file - test
    const uri = require('./assets/spring-awakening-3132112_1920.jpg').url;
    await uploadImageAsync(uri);
  }
}

async function uploadImageAsync(uri) {
  console.log("in upload image async fn");
  
  const response = await fetch(uri);
  const blob = await response.blob();
  childRef
    .put(blob)
    .then(function(snapshot) {
      console.log('Uploaded a blob or file!');
      
      console.log("download url === " + childRef.getDownloadURL());
    })
    .catch(function(error) {
      console.error('Upload Error');
    });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  },
  logo: {
    height: 80,
    marginBottom: 16,
    marginTop: 32,
    width: 80,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  modules: {
    margin: 20,
  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  }
});
