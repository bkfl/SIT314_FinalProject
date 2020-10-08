import Head from 'next/head'
import { Container, Button } from 'react-bootstrap'

import Login from '../components/login'
import Devices from '../components/devices'

export default class Home extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = { token: "" };

    this.setToken = this.setToken.bind(this);
  }

  setToken(newToken) {
    this.setState({
      token: newToken
    });
  }

  render() {
    return (
    <Container className="p-3">
      <Head>
        <title>IoT Lighting Platform</title>
      </Head>

      <main>
        <h1 className="text-center">IoT Lighting Platform</h1>
        {this.state.token == ""
          ? <Login setToken={this.setToken} />
          : <Devices token={this.state.token} />
        }
      </main>
    </Container>
  )}
}
