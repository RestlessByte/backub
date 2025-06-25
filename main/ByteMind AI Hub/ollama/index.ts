import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HUGGING_FACE_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;
if (!HUGGING_FACE_API_TOKEN) {
  console.error('Error: Hugging Face API token is not set. Please check your .env configuration.');
  process.exit(1);
}

async function runModel(modelId: string, input: string): Promise<any> {
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${modelId}`,
      { inputs: input },
      {
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Error from API - Status: ${error.response.status} ${error.response.statusText} - ${error.response.data?.error || 'No additional details'}`);
    } else {
      console.error('Unexpected error:', error.message || error);
    }
    throw error;
  }
}

(async () => {
  try {
    const modelId = 'DeepSeek-R1';
    const input = 'Provide the input text here for DeepSeek R1 to process.';
    const result = await runModel(modelId, input);
    console.log('Model Result:', result);
  } catch (error) {
    console.error('Failed to fetch model result:', error);
  }
})();