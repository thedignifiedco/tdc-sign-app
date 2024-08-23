# Adobe Sign API Demo App

This web app is built to demonstrate some capabilities of Adobe Sign REST API.

## Features

- **Send Agreement**: Create an agreement using either a transient document or a library document. If a Library Document ID is not defined, your most recent library document will be used to create a new agreement.
- **Get Agreements**: Fetch and display the status of the last 10 agreements.
- **Templates**: Retrieve and display a list of the last 10 templates.
- **Send Reminder**: Manually send reminders for agreements.
- **Download Agreements**: Download signed agreements.
- **Embedded Signing**: Get signing URL and host embedded/in-app signing.

## Requirements

An [Adobe Sign Integration Key](https://helpx.adobe.com/sign/kb/how-to-create-an-integration-key.html) (with limited scopes – `user_login`, `agreement_read`, `agreement_write`, `agreement_send`, `library_read`, `workflow_read`) is required to use this application.

Please submit it in the "Integration Key" field to begin using this app.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/thedignifiedco/tdc-sign-app.git
    cd tdc-sign-app
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the development server:
    ```bash
    npm run dev
    ```

4. Open your browser and navigate to:
    ```
    http://localhost:3000
    ```

## Usage

1. **Integration Key**: Enter your Adobe Sign integration key in the provided field.
2. **Send Tab**:
    - Enter the agreement name and recipient email.
    - Select either "Transient Document" or "Library Document".
    - If "Transient Document" is selected, upload a PDF file. The app will automatically make a `POST /transientDocuments` call.
    - If "Library Document" is selected, enter the `libraryDocumentId`.
    - Click "Send" to create and send the agreement.
3. **Agreements Tab**:
    - Click "Get All Agreements" to fetch and display the last 10 agreements.
    - Click a row to view more options: "Send Reminder", "Sign", "Download".
    - "Send Reminder" sends a reminder for the selected agreement.
    - "Sign" opens an embedded signing URL.
    - "Download" downloads the signed agreement.
4. **Templates Tab**:
    - Click "Get All Templates" to fetch and display the last 10 templates.
    - Click a row to copy the document ID to the clipboard.
5. **Console Tab**:
    - View all logged API requests and responses in a human-readable format.

## Adobe Sign API
Read more about Adobe Sign REST APIs here:
[Adobe Sign REST API Documentation](https://www.adobe.io/apis/documentcloud/sign/docs.html#!adobedocs/adobe-sign/master/README.md)
