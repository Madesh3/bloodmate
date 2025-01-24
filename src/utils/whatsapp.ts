import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const formatPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  
  if (!digits.startsWith('91') && !digits.startsWith('1')) {
    return `91${digits}`;
  }
  
  return digits;
};

export const sendWhatsAppMessage = async (phoneNumber: string, recipientName: string, adminNumber: string) => {
  try {
    const { data: secretsData, error: secretsError } = await supabase
      .from('secrets')
      .select('*')
      .in('name', ['WHATSAPP_API_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID']);

    if (secretsError) throw secretsError;

    const apiToken = secretsData?.find(s => s.name === 'WHATSAPP_API_TOKEN')?.secret;
    const phoneNumberId = secretsData?.find(s => s.name === 'WHATSAPP_PHONE_NUMBER_ID')?.secret;

    if (!apiToken || !phoneNumberId) {
      throw new Error('WhatsApp API credentials not configured');
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    console.log('Sending message to formatted number:', formattedPhone);

    const response = await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "template",
        template: {
          name: "hello_world",
          language: {
            code: "en_US"
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: recipientName
                },
                {
                  type: "text",
                  text: adminNumber
                }
              ]
            }
          ]
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('WhatsApp API error response:', errorData);
      
      if (errorData.error?.code === 131030) {
        throw new Error(`Phone number ${formattedPhone} is not in the WhatsApp test number list. During development, you can only send messages to numbers that are registered for testing.`);
      }
      
      throw new Error(`WhatsApp API error: ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
};