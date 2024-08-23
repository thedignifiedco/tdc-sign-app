'use client';

import { useState } from 'react';
import { Button, Table, Alert, Spinner } from 'react-bootstrap';
import api from '../api';

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchTemplates = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const integrationKey = localStorage.getItem('integrationKey');
      if (!integrationKey) {
        throw new Error('Integration key not set');
      }

      const response = await api.get(
        '/libraryDocuments',
        {
          headers: {
            'Authorization': `Bearer ${integrationKey}`,
          },
          params: {
            pageSize: 10,
          },
        }
      );

      setTemplates(response.data.libraryDocumentList);
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (documentId) => {
    navigator.clipboard.writeText(documentId)
      .then(() => {
        setMessage({ type: 'success', text: 'Document ID copied to clipboard' });
      })
      .catch((error) => {
        setMessage({ type: 'danger', text: error.message || 'Failed to copy Document ID' });
      });
  };

  return (
    <>
      <Button variant="primary" onClick={fetchTemplates} disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Get All Templates'}
      </Button>

      {message && (
        <Alert variant={message.type} className="mt-3">
          {message.text}
        </Alert>
      )}

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Document Name</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr key={template.id} onClick={() => handleRowClick(template.id)}>
              <td>{template.name}</td>
              <td>{template.templateTypes}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
