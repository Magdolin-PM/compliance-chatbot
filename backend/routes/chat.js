const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  // Validate incoming message
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    console.log("Received user message:", message);

    // Call the OpenAI API
    const apiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `
              You are a GDPR compliance expert. Provide answers in the following structure:

              1. Contextual Overview:
              - Purpose: Set the stage and clarify the question or topic.
              - Include: A brief explanation of the topic's importance, key considerations, and a one-sentence framing of the query.

              2. Actionable Steps:
              - Purpose: Provide 3 to 5 concise, prioritized steps for implementation or problem-solving.
              - Include: Practical examples or tool suggestions where helpful.

              3. Pitfalls and Best Practices:
              - Purpose: Help users avoid mistakes and align with proven strategies.
              - Include: Common pitfalls with brief explanations and key best practices.
            `,
          },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Log the response from OpenAI
    console.log("OpenAI API Response:", apiResponse.data);

    // Return the bot's reply to the frontend
    const botReply = apiResponse.data.choices[0]?.message?.content || "No response from OpenAI.";
    res.status(200).json({ reply: botReply });
  } catch (error) {
    console.error("Error communicating with OpenAI API:", error.message);
    if (error.response) {
      console.error("OpenAI API Error Response:", error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: 'Failed to process chat request.' });
    }
  }
});

module.exports = router;
