'use client';

import { useState } from 'react';
import { Row, Col, Button, Table, Alert, Spinner, Modal } from 'react-bootstrap';
import api from '../api';

export default function Agreements() {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);

  const fetchAgreements = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const integrationKey = localStorage.getItem('integrationKey');
      if (!integrationKey) {
        throw new Error('Integration key not set');
      }

      const response = await api.get(
        '/agreements',
        {
          headers: {
            'Authorization': `Bearer ${integrationKey}`,
          },
          params: {
            pageSize: 10,
          },
        }
      );

      setAgreements(response.data.userAgreementList);
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (agreement) => {
    setSelectedAgreement(agreement);
    setShowModal(true);
  };

  const handleSendReminder = async () => {
    setMessage(null);
    try {
      const integrationKey = localStorage.getItem('integrationKey');

      // Fetch participant set and participant ID
      const participantsResponse = await api.get(
        `/agreements/${selectedAgreement.id}/members?includeNextParticipantSet=true`,
        {
          headers: {
            'Authorization': `Bearer ${integrationKey}`,
          },
        }
      );

      const participantSets = participantsResponse.data.nextParticipantSets;
      const participantSetId = participantSets[0].id; // Assuming the first participant set
      const participantId = participantSets[0].memberInfos[0].id; // Assuming the first participant in the set

      // Send reminder
      await api.post(
        `/agreements/${selectedAgreement.id}/reminders`,
        {
            recipientParticipantIds: [participantId],
            status: 'ACTIVE'
        },
        {
          headers: {
            'Authorization': `Bearer ${integrationKey}`,
            'Content-Type': 'application/json'
          },
        }
      );

      setMessage({ type: 'success', text: 'Reminder sent successfully' });
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || error.message || 'An error occurred' });
    }
  };

  const handleSign = async () => {
    setMessage(null);
    try {
      const integrationKey = localStorage.getItem('integrationKey');
      const response = await api.get(
        `/agreements/${selectedAgreement.id}/signingUrls`,
        {
          headers: {
            'Authorization': `Bearer ${integrationKey}`,
          },
        }
      );
      setIframeUrl(response.data.signingUrlSetInfos[0].signingUrls[0].esignUrl);
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || error.message || 'An error occurred' });
    }
  };

  const handleDownload = async () => {
    setMessage(null);
    try {
      const integrationKey = localStorage.getItem('integrationKey');
      const response = await api.get(
        `/agreements/${selectedAgreement.id}/documents`,
        {
          headers: {
            'Authorization': `Bearer ${integrationKey}`,
          },
        }
      );

      const documentId = response.data.documents[0].id;
      const downloadResponse = await api.get(
        `/agreements/${selectedAgreement.id}/documents/${documentId}`,
        {
          headers: {
            'Authorization': `Bearer ${integrationKey}`,
            'Accept': 'application/pdf',
          },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedAgreement.name}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setMessage({ type: 'success', text: 'Document downloaded successfully' });
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || error.message || 'An error occurred' });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAgreement(null);
    setIframeUrl(null);
  };

  return (
    <>
      <Button block variant="primary" onClick={fetchAgreements} disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Get All Agreements'}
      </Button>

      {message && (
        <Alert variant={message.type} className="mt-3">
          {message.text}
        </Alert>
      )}

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Agreement Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {agreements.map((agreement) => (
            <tr key={agreement.id} onClick={() => handleRowClick(agreement)}>
              <td>{agreement.name}</td>
              <td>{agreement.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>

<Modal dialog centered show={showModal} onHide={handleCloseModal} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Agreement Actions</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Row>
        <Col className="d-grid gap-2">
            <Button variant="warning" onClick={handleSendReminder}>
                Send Reminder
            </Button>
        </Col>
        <Col className="d-grid gap-2">
            <Button variant="primary" onClick={handleSign}>
                Sign
            </Button>
        </Col>
        <Col className="d-grid gap-2">
            <Button variant="success" onClick={handleDownload}>
                Download
            </Button>
        </Col>
    </Row>
    {message && (
        <Alert variant={message.type} className="mt-3">
          {message.text}
        </Alert>
      )}
    {iframeUrl && (
      <iframe
        src={iframeUrl}
        className="sign_window"
        title="Sign Agreement"
        width="100%"
        height="400px"
        style={{ border: 'none' }}
      />
    )}
  </Modal.Body>
</Modal>
    </>
  );
}
