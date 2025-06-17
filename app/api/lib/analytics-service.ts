// Bu değerleri .env dosyasından çekmek en iyi pratiktir.
// Örn: process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT
const ANALYTICS_ENDPOINT = 'https://analytics.keremkk.com.tr/api/analytics';
const APP_ID = 'pikamed'; // Uygulama kimliğiniz

interface AnalyticsEventPayload {
  userId: string;
  eventEndpoint: string;
}

/**
 * Harici analitik servisine bir olay gönderir.
 * Bu fonksiyon "fire-and-forget" olarak tasarlanmıştır, yani ana API akışını bekletmez.
 * Hataları sadece konsola loglar.
 */
export function sendAnalyticsEvent(payload: AnalyticsEventPayload): void {
  const { userId, eventEndpoint } = payload;

  const body = {
    appId: APP_ID,
    userId: userId || 'unknown',
    endpoint: eventEndpoint,
  };

  fetch(ANALYTICS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  .then(response => {
    if (response.ok) {
      console.log('✅ Analytics event sent successfully.');
    } else {
      console.warn(`⚠️ Failed to send analytics event. Status: ${response.status}`);
    }
  })
  .catch(error => {
    console.error('❌ Error sending analytics event:', error);
  });
}