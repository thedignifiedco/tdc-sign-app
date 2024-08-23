'use client';

import { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../api';

export default function Send() {
  const [agreementName, setAgreementName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [documentType, setDocumentType] = useState('Select Document Type');
  const [transientFile, setTransientFile] = useState(null);
  const [libraryDocumentId, setLibraryDocumentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setTransientFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const integrationKey = localStorage.getItem('integrationKey');

      if (!integrationKey) {
        throw new Error('Integration key not set');
      }

      let transientDocumentId;

      if (documentType === 'Transient Document' && transientFile) {
        // Create FormData object
        const formData = new FormData();
        formData.append('File-Name', transientFile.name);
        formData.append('File', transientFile);
        console.log(transientFile);
        console.log(formData.get('File'));

        // Upload Transient Document
        const response = await api.post(
          '/transientDocuments',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${integrationKey}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        transientDocumentId = response.data.transientDocumentId;
      }

      // Prepare Agreement Creation Data
      const agreementData = {
        name: agreementName,
        participantSetsInfo: [{
          memberInfos: [{
            email: recipientEmail
          }],
          order: 1,
          role: 'SIGNER'
        }],
        fileInfos: [{
          transientDocumentId: documentType === 'Transient Document' ? transientDocumentId : undefined,
          libraryDocumentId: documentType === 'Library Document' ? libraryDocumentId : undefined
        }],
        signatureType: 'ESIGN',
        state: 'IN_PROCESS'
      };

      // Create Agreement
      const agreementResponse = await api.post(
        '/agreements',
        agreementData,
        {
          headers: {
            'Authorization': `Bearer ${integrationKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setResult({
        agreementId: agreementResponse.data.id,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="agreementName">
        <Form.Label>Agreement Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter agreement name"
          value={agreementName}
          onChange={(e) => setAgreementName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="recipientEmail">
        <Form.Label>Recipient Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter recipient email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="documentType">
        <Form.Label>Document Type</Form.Label>
        <Form.Select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
        >
          <option>Select Document Type</option>
          <option>Transient Document</option>
          <option>Library Document</option>
        </Form.Select>
      </Form.Group>

      {documentType === 'Transient Document' && (
        <Form.Group controlId="transientFile">
          <Form.Label>Upload Transient Document</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            required
          />
        </Form.Group>
      )}

      {documentType === 'Library Document' && (
        <Form.Group controlId="libraryDocumentId">
          <Form.Label>Library Document ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter library document ID"
            value={libraryDocumentId}
            onChange={(e) => setLibraryDocumentId(e.target.value)}
            required
          />
        </Form.Group>
      )}

      <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Send'}
      </Button>

      {result && (
        <Alert variant="success" className="mt-3">
          <strong>Agreement Sent Successfully!</strong>
          <p><strong>Agreement ID:</strong> {result.agreementId}</p>
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </Form>
  );
}
