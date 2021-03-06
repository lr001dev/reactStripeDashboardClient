import React from 'react';
import { BASE_URL } from './constants.js'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import Header from './components/Header'
import Footer from './components/Footer'
import CreateAccount from './components/CreateAccount'
import Dashboard from './components/Dashboard'

class App extends React.Component {
  state = {
    sessions: [],

  }
  componentDidMount() {
    this.checkUser()
    this.getSessions()
  }
  checkUser() {
    fetch(`${ BASE_URL }/users/check/`, {
      credentials: 'include'
    })
    .then(response => response.json())
    .then((userIsLoggedIn) => {
      this.setState({ user: userIsLoggedIn.user })
    }).catch(err=> console.log(err))
  }

  logoutUser = () => {
    fetch(`${ BASE_URL }/users/destroyCookie/`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(() => {
      this.setState({ user: undefined })
      this.getSessions()
    }).catch(err=> console.log(err))
  }

  getSessions() {
    fetch(`${ BASE_URL }/sessions/`)
    .then(response => response.json())
    .then((sessionData) => {
      this.setState({ sessions: sessionData})
    })
    .catch(err=> console.log(err))
  }

  createAccount = (formInputs) => {
    const autoLogin = {
      user: {
        username: formInputs.user.username,
        password: formInputs.user.password
      }
    }

    fetch(`${ BASE_URL }/users/`, {
      body: JSON.stringify(formInputs),
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-type': 'application/json'
      }
    })
    .then((theResponse) => {
      if(theResponse) {
        this.loginTheUser(autoLogin)
      }
    })
    .catch(err=> console.log(err))
  }

  loginTheUser = (formInputs) => {
    fetch(`${ BASE_URL }/users/login/`, {
      body: JSON.stringify(formInputs),
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-type': 'application/json'
      }
    }).then(loginResponse => loginResponse.json())
      .then((userIsLoggedIn) => {
        this.setState({ user: userIsLoggedIn.user.id })
      })
      .catch(error=> console.log(error))
  }

  render() {

    if(this.state.user) {
      return(
        <Router>
          <Redirect to='/dash' />
          <Route
            path="/dash"
            render= { (props) => <Dashboard { ...props }
            currentUser= { this.state.user }
            sessions= { this.state.sessions }
            logoutUser= { this.logoutUser }
          /> }
          />
        </Router>
      )
    } else {
      return (
        <Router>
          <Header
            sessions = { this.state.sessions }
            loginTheUser = { this.loginTheUser }
          />
          <Route
            path="/create-account"
            render= { (props) => <CreateAccount { ...props }
            createAccount= { this.createAccount }
          /> }
          />

          <Footer />
        </Router>
      )
    }
  }

}

export default App
