import React, { Component } from 'react'
import { BASE_URL } from '../constants.js'
import { Container, Card, Button  } from 'react-bootstrap'

class DashboardProfile extends React.Component {
  state = {
    currentUser: this.props.currentUser
  }

  deleteBooking = (bookingId, index) => {
    fetch(`${ BASE_URL }/users/${this.state.currentUser.user.id}/bookings/${bookingId}/`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    }).then(this.props.bookingDeleted(index))
      .catch(err=> console.log(err))
  }

  render() {
    return (
      <Container>
      {
        this.state.currentUser.bookings.map((theBooking, index) => {
            if(index < 4) {
              return(
                <Card key={index} body>
                  { theBooking.name }
                  <Button
                    onClick={() => {
                      this.deleteBooking(theBooking.id, index)
                    }}
                    variant="primary">Delete Booking
                    </Button>
                </Card>
              )
            }
          })
      }
      </Container>
    )
  }
}

export default DashboardProfile
