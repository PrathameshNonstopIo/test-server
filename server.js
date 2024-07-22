const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse the body of POST requests
app.use(express.json());

// Route to handle the Slack command
app.post('/slack-codemagic', async (req, res) => {
  const { text, user_name } = req.body;

  const codemagicApiUrl = 'https://api.codemagic.io/builds';
  const apiToken = 'seQdreMS8AXAkrQ9ibJEH6qyZYHBIiWhKYfHxupHEdc'; // Replace with your actual API token

  // Construct the payload
  const payload = {
    appId: '669764b7268752da12b2e8a2', // Replace with your app ID
    workflowId: 'firebase-app-workflow', // Replace with your workflow ID
    branch: text || 'main' // Default to 'main' if text is not provided
  };

  try {
    // Send POST request to CodeMagic API
    const response = await axios.post(codemagicApiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': apiToken // Authentication token
      }
    });

    // Send a response back to Slack
    res.status(200).send(`Build triggered successfully by ${user_name} for branch ${text}`);
  } catch (error) {
    console.error('Error triggering CodeMagic build:', error.response ? error.response.data : error.message);
    res.status(500).send('Failed to trigger build');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
