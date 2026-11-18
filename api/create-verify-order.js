// api/create-verify-order.js
export default async function handler(req, res) {
  // Sirf POST request allow karein
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, productName, userId } = req.body;

  try {
    // YAHAN AAPKO APNE TRUST GATEWAY KI API CALL LAGANI HAI
    // Niche wala code ek example hai, aapko apne gateway ke docs ke hisaab se change karna hoga

    // ... (upar ka code same rahega)

    const gatewayResponse = await fetch('https://api.bytrustgate.com/api/v1/create-order', { // 👈 URL yahan badla hai
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TRUST_GATEWAY_API_KEY}`,
        'Content-Type': 'application/json'
      },
// ... (baaki ka code same rahega),
      body: JSON.stringify({
        amount: amount * 100, // Amount hamesha paise (cents) mein bhejte hain
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          userId: userId, 
          productName: productName
        }
      })
    });

    const data = await gatewayResponse.json();

    if (data.payment_url || data.short_url) {
      // Agar gateway payment link deta hai, toh frontend ko bhej dein
      return res.status(200).json({ paymentUrl: data.payment_url || data.short_url });
    } else {
      return res.status(400).json({ error: data.message || 'Gateway Error' });
    }
  } catch (error) {
    console.error("Gateway Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
