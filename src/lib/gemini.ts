export interface ChatMessage {
  role: 'user' | 'model' | 'assistant';
  parts: { text: string }[];
}

export const chatWithSalesAI = async (messages: any[]) => {
  try {
    const response = await fetch('/api/ai-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: messages[messages.length - 1]?.parts?.[0]?.text || '',
        context: {}
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.response || 'I apologize, but I could not process your request.';
  } catch (error) {
    console.error('chatWithSalesAI error:', error);
    return 'I apologize, but I encountered an error. Please try again.';
  }
};

export const generateProductDescription = async (productName: string) => {
  try {
    const response = await fetch('/api/ai-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Write a compelling product description for: ${productName}`,
        context: { path: '/admin/products', isAdmin: true }
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.response || `High-quality ${productName} from SAVIMAN. Precision engineered for durability and performance.`;
  } catch (error) {
    console.error('generateProductDescription error:', error);
    return `High-quality ${productName} from SAVIMAN. Precision engineered for durability and performance.`;
  }
};

export const getAdminAIAction = async (prompt: string) => {
  try {
    const response = await fetch('/api/ai-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        context: { path: '/admin', isAdmin: true }
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.response || 'Action completed.';
  } catch (error) {
    console.error('getAdminAIAction error:', error);
    return 'Action failed. Please try again.';
  }
};
