import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Profile from './components/Profile/Profile';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Modal from './components/Modal/Modal';
import Rank from './components/Rank/Rank';
import './App.css';

const particlesOptions = {
  //customize this to your liking
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    pet: '',
    age: null
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount(){
    const token = window.sessionStorage.getItem('token');
    if(token){
      fetch('http://localhost:3000/signin', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        }
      })
        .then(response => response.json())
        .then(data => {
          if(data && data.id) {
            fetch(`http://localhost:3000/profile/${data.id}` , {
              method: 'get',
              headers:{
                'Content-Type' : 'application/json',
                'Authorization' : token
              },
            })
              .then(response => response.json())
              .then(user => {
                if(user && user.email){
                  this.loadUser(user);
                  this.onRouteChange('home');
                }
              })
              .catch(console.log);
          }
        })
        .catch(console.log);
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      pet: data.pet,
      age: data.age,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    if(data && data.outputs){
      const noOfFaces = data.outputs[0].data.regions.length;
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const clarifaiFaces = data.outputs[0].data.regions;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      let boxes = []
      for( let i = 0; i < noOfFaces; i++){
        boxes.push({
            leftCol: clarifaiFaces[i].region_info.bounding_box.left_col * width,
            topRow: clarifaiFaces[i].region_info.bounding_box.top_row * height,
            rightCol: width - (clarifaiFaces[i].region_info.bounding_box.right_col * width),
            bottomRow: height - (clarifaiFaces[i].region_info.bounding_box.bottom_row * height)      
        })
      }
      return boxes;
    }

    return ;
  }

  displayFaceBox = ( boxes ) => {
    if(boxes){
      this.setState({boxes: boxes});      
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'authorization': window.sessionStorage.getItem('token')
        },
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              'authorization': window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(console.log)

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      return this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  toogleModal = () =>{
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }));
  }

  render() {
    const { isSignedIn, imageUrl, route, boxes,isProfileOpen, user} = this.state;
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} toogleModal={this.toogleModal} />
        { isProfileOpen && 
          <Modal>
            <Profile 
              isProfileOpen = {isProfileOpen} 
              toogleModal = {this.toogleModal}
              user = {user}
              loadUser = {this.loadUser}
            />
          </Modal>
        }
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
