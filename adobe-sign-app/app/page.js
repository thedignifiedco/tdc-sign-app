'use client';

import { useState } from 'react';
import { Tabs, Tab, Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import Send from './components/Send';
import Agreements from './components/Agreements';
import Templates from './components/Templates';

export default function Home() {
  const [key, setKey] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [tabKey, setTabKey] = useState('send');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('integrationKey', key);
      setAlertMessage('Integration key set successfully.');
      setShowAlert(true);
    } catch (error) {
      setAlertMessage('Failed to set integration key.');
      setShowAlert(true);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="12">
          <h1 className="logo">Adobe Sign</h1>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col lg="8" md="10">
          <p>This web app is built to demonstrate some capabilites of <b><a href="https://developer.adobe.com/document-services/apis/sign-api/" target="_blank" rel="nofollow">Adobe Sign REST API</a></b>.</p>
          <p>An Adobe Sign <b><a href="https://helpx.adobe.com/sign/kb/how-to-create-an-integration-key.html" target="_blank" rel="nofollow">integration key</a></b> (with limited scopes – <i>user_login</i>, <i>agreement_read</i>, <i>agreement_write</i>, <i>agreement_send</i> & <i>library_read</i>) is required to use this application.</p>
        </Col>
        <Col lg="8" md="10" className="integrationKeyForm">
          <Form onSubmit={handleSubmit}>
            <Row className="align-items-center">
              <Col lg="6" md="10">
                <p>Submit your integration key, to begin using this app.</p>
              </Col>
              <Col lg="4" md="8" xs="8">
                <Form.Control
                  type="password"
                  placeholder="Enter your integration key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                />
              </Col>
              <Col lg="2" md="4" xs="4">
                <Button variant="primary" type="submit" className="mt-2 mb-2">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
          {showAlert && <Alert variant="success" className="mt-3">{alertMessage}</Alert>}
        </Col>
      </Row>
      <Row className="justify-content-md-center" >
        <Col lg="8" md="10">
          <Tabs
            id="controlled-tab-example"
            activeKey={tabKey}
            onSelect={(k) => setTabKey(k)}
            className="mt-4"
            fill
          >
            <Tab eventKey="send" title="Send">
              <Send />
            </Tab>
            <Tab eventKey="agreements" title="Agreements">
              <Agreements />
            </Tab>
            <Tab eventKey="templates" title="Templates">
              <Templates />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}
