'use client';

import { useState } from 'react';
import { Tabs, Tab, Container, Form, Button, Alert, Row } from 'react-bootstrap';
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
      <div className="col-md-12">
        <h1 className="logo">Adobe Sign</h1>
      </div>
      <Row className="justify-content-md-center">
        <div className="col-md-5">
          <p>This web app is built to demonstrate some capabilites of Adobe Sign REST API.</p>
          <p>An Adobe Sign <a href="https://helpx.adobe.com/sign/kb/how-to-create-an-integration-key.html" target="_blank" rel="nofollow">integration key</a> (with limited scopes – <b>user_login</b>, <b>agreement_read</b>, <b>agreement_write</b>, <b>agreement_send</b>, <b>library_read</b> & <b>workflow_read</b>) is required to use this application.</p>
          <p>Submit your integration key, to begin using this app.</p>
        </div>
        <div className="integrationKeyForm col-md-3">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="integrationKey" className="d-grid gap-2">
              <Form.Label>Integration Key</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your integration key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              Set Integration Key
            </Button>
          </Form>
          {showAlert && <Alert variant="success" className="mt-3">{alertMessage}</Alert>}
        </div>
      </Row>
      <Row className="justify-content-md-center" >
        <div className="col-md-8">
          <Tabs
            id="controlled-tab-example"
            activeKey={tabKey}
            onSelect={(k) => setTabKey(k)}
            className="mt-4"
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
        </div>
      </Row>
    </Container>
  );
}
