const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export async function sendChatMessage(message) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, { // Use dynamic base URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return await response.json(); // Return parsed response
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    throw error;
  }
}
