import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/navigation/Navigation';
import FaceRecognition from './components/facerecognition/FaceRecognition';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import Signin from './components/signin/Signin';
import Register from './components/register/Register';
import './App.css';

const particlesOptions = {
	particles: {
    	number: {
    		value: 100,
    		density: {
    			enable: true,
    			value_area: 800
    		}
    	}
	}
}

const initialState = {
  input: '',
  imageUrl:'',
  model: 'GENERAL_MODEL',
  box: {},
  route: 'signin',
  isSignedIn : false,
  user : {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}
class App extends Component {
	constructor(){
		super();
		this.state = initialState;
	}

  updateEntries = () => {
    
    fetch('https://mighty-wave-62291.herokuapp.com/image', {
//    fetch('http://localhost:3000/image', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: this.state.user.id
      })
    }).then(response => response.json())
    .then(count => {
      this.setState(Object.assign(this.state.user, { entries: count }))
    })
    .catch(console.log)
  } 

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  imageDescriptions = (data) => {
    document.getElementById("descriptions").innerHTML = "";
    for (let i = 0; i < 20; i++) {
      document.getElementById("descriptions").innerHTML += data.outputs[0].data.concepts[i].name + "</br>";
    };
  
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

	onInputChange =(event) =>{
    	this.setState({input: event.target.value})
	}

    onSelectChange =(event) =>{
      this.setState({model: event.target.value})
  }

  getPictureResults = (input) => {
     this.setState({box: {}});
     document.getElementById("descriptions").innerHTML ="";
       fetch(' https://mighty-wave-62291.herokuapp.com/imageurl', {
//     fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input,
          model: input
        })
     })
     .then(response => response.json())  
     .then(response => {
        if (response) { this.updateEntries() }
        if (input === 'GENERAL_MODEL'){
          this.imageDescriptions(response)
        }
        if (input === 'FACE_DETECT_MODEL') {
           this.displayFaceBox(this.calculateFaceLocation(response))
        }
     })
     .catch(err => console.log(err));
  }

  onButtonSubmit = (event) =>{
  	this.setState({imageUrl: this.state.input})
    this.getPictureResults(this.state.model);
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    }
    else if (route === 'home'){
      this.setState({isSignedIn: true});
    }
        this.setState({route: route});
  }

  loadUser = (data) => {
    this.setState({user : {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  render() {
      return (
        <div className="App">
          <Particles  className='particles' params={particlesOptions}/>
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
          
         { this.state.route === 'home'
         ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} onSelectChange={this.onSelectChange}/>
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
         </div>
         :(
           this.state.route === 'register'
           ?<Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
           :<Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
         )
         }
        </div>
    );
  }
}

export default App;