// Generate MoMo API User
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

// This function creates a MoMo API user and returns the userId (referenceId).
export const createApiUser = async () => {
  const referenceId = uuidv4();
  const subscriptionKey = process.env.MOMO_SUBSCRIPTION_KEY; // Make sure this is defined in your .env

  if (!subscriptionKey) {
    console.error('❌ Missing MOMO_SUBSCRIPTION_KEY in .env');
    return;
  }
 
  try {
    const response = await axios.post(
      'https://sandbox.momodeveloper.mtn.com/v1_0/apiuser',
      {
        providerCallbackHost: 'https://car-rental-service-ix4n.onrender.com/momo/notify', 
      },
      {
        headers: {
          'X-Reference-Id': referenceId,
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ API User created successfully!');
    console.log('Reference ID (userId):', referenceId);
  } catch (error) {
    console.error('❌ Failed to create API user');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
};

// Generate MoMo API key
export const generateApiKey = async () => {
  const subscriptionKey = process.env.MOMO_SUBSCRIPTION_KEY; // Make sure this is defined in your .env
  const apiUserId = process.env.MOMO_API_USER; // Use a unique userId for the API key generation
  if (!subscriptionKey) {
    console.error('❌ Missing MOMO_SUBSCRIPTION_KEY in .env');
    return;
  }

  try {
    const response = await axios.post(
      `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${apiUserId}/apikey`,
      {},
      {
        headers: {
          'X-Reference-Id': apiUserId,
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ API Key generated successfully!');
    console.log('API Key:', response.data.apiKey);
  } catch (error) {
    console.error('❌ Failed to generate API key');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
};
