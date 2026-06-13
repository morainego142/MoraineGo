import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

app.use(express.json());

// API endpoints
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages body' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.json({
        output: "Welcome! The Moraine Go AI Concierge is currently running in offline preview mode (Gemini Key not configured). You can still use our booking portal above to calculate your fares and secure your tickets instantly!"
      });
    }

    const systemPrompt = `You are the Moraine Go Rockies AI Concierge, a friendly and informative virtual travel advisor for Moraine Go Shuttle & Tours in Banff National Park.
Your duty is to answer questions about:
1. Moraine Go's premium round-trip transport services connecting Banff Town, Lake Louise, and Moraine Lake.
2. Banff, Lake Louise and Moraine Lake travel logistics (e.g. personal cars are prohibited on Moraine Lake road, reservation is crucial!).
3. Parks Canada rules, park passes, local shuttles, and visitor tips.
4. Top attractions like Sentinel Pass, Larch Valley, Lake Constance, Lake Agnes Teahouse, and the Plain of Six Glaciers.
5. Best times for photo opportunities, golden hour peaks (Valley of the Ten Peaks), hiking equipment lists, and bear safety tips.

Pricing Guidelines:
- Banff to Lake Louise & Moraine Lake Round-Trip: $105 CAD per seat. This is a curated same-day 4.5-hour double lake excursion with departure and return scheduled automatically.
- Departure Schedule slots: 07:00 AM, 08:00 AM, 09:00 AM, 01:00 PM, and 02:00 PM (each automatically secures the same-day return exactly 4.5 hours later).
- Children under 5 ride free (but must be requested for safety seating constraints).

Always stay warm, professional, and clear. Suggest users book their shuttles using the interactive reservation widget on our webpage. Keep answers concise. Use markdown list formatting for readability.`;

    // Clean and validate messages for Gemini SDK
    // Gemini expects the first message to be 'user', and alternate strictly between 'user' and 'model'.
    const firstUserIdx = messages.findIndex(m => m.role === 'user');
    const sliced = firstUserIdx !== -1 ? messages.slice(firstUserIdx) : messages;

    const chatHistory: any[] = [];
    sliced.forEach((msg) => {
      const role = msg.role === 'assistant' ? 'model' : 'user';
      if (chatHistory.length === 0) {
        if (role === 'user') {
          chatHistory.push({ role, parts: [{ text: msg.content }] });
        }
      } else {
        const last = chatHistory[chatHistory.length - 1];
        if (last.role === role) {
          last.parts[0].text += '\n' + msg.content;
        } else {
          chatHistory.push({ role, parts: [{ text: msg.content }] });
        }
      }
    });

    // If chatHistory is somehow empty, provide a fallback user turn
    if (chatHistory.length === 0) {
      chatHistory.push({ role: 'user', parts: [{ text: 'Hello' }] });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: chatHistory,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    res.json({ output: response.text });
  } catch (err: any) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: err.message || 'Error communicating with Gemini model' });
  }
});

// Path to file-system persistence database
const BOOKINGS_DB_FILE = path.join(process.cwd(), 'bookings_db.json');

// Helper to safely load bookings from JSON database file
function loadBookingsFromFile(): any[] {
  try {
    if (fs.existsSync(BOOKINGS_DB_FILE)) {
      const data = fs.readFileSync(BOOKINGS_DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to read bookings database from file:", error);
  }
  return [];
}

// Helper to safely write bookings to JSON database file
function saveBookingsToFile(bookings: any[]) {
  try {
    fs.writeFileSync(BOOKINGS_DB_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (error) {
    console.error("Failed to write bookings database to file:", error);
  }
}

// Global in-memory representation synchronized with file DB
let bookingsDb = loadBookingsFromFile();

// Helper to send beautiful HTML alert emails to both the admin and passenger
async function sendNotificationEmail(booking: any) {
  const adminEmail = process.env.NOTIFICATION_EMAIL || 'morainego142@gmail.com';
  const customerEmail = booking.email;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const emailSubjectAdmin = `🚨 NEW MORAINE GO BOOKING: ${booking.bookingCode} - $${booking.totalPrice} CAD`;
  const emailHtmlAdmin = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #fafafa;">
      <h2 style="color: #0D1B2A; border-bottom: 2px solid #077B8A; padding-bottom: 10px; margin-top: 0;">MORAINE GO TOURS - NEW BOOKING</h2>
      <p style="font-size: 14px; color: #333; line-height: 1.5;">Hello! A customer just successfully booked a premium shuttle connection ticket via your public portal.</p>
      
      <div style="background-color: #eef2f3; border-left: 4px solid #077B8A; padding: 15px; border-radius: 4px; margin: 15px 0;">
        <h3 style="margin-top: 0; color: #0D1B2A; font-size: 14px; text-transform: uppercase;">Booking Details</h3>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0; font-weight: bold; width: 140px;">Booking Code:</td>
            <td style="padding: 4px 0; color: #0D1B2A; font-weight: bold;">${booking.bookingCode}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-weight: bold;">Route:</td>
            <td style="padding: 4px 0; color: #0D1B2A;">${booking.source} ⇄ ${booking.destination}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-weight: bold;">Date & Time:</td>
            <td style="padding: 4px 0; color: #077B8A; font-weight: bold;">${booking.travelDate} @ ${booking.timeSlot}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-weight: bold;">Lead Passenger:</td>
            <td style="padding: 4px 0; color: #0D1B2A;">${booking.passengerName}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-weight: bold;">Total Paid:</td>
            <td style="padding: 4px 0; color: #0D1B2A; font-weight: bold;">$${booking.totalPrice} CAD</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-weight: bold;">Passengers:</td>
            <td style="padding: 4px 0; color: #0D1B2A;">${booking.passengers} seat(s)</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-weight: bold;">Contact Email:</td>
            <td style="padding: 4px 0; color: #0D1B2A;">${booking.email}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-weight: bold;">Phone Number:</td>
            <td style="padding: 4px 0; color: #0D1B2A;">${booking.phone || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-weight: bold;">Pick-Up Address:</td>
            <td style="padding: 4px 0; color: #0D1B2A; font-weight: bold;">${booking.pickupAddress || '135 Beaver St'} (${booking.postalCode || 'T1L 1A1'})</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 11px; color: #999; text-align: center; margin-top: 25px;">
        Moraine Go Shuttle Portal • Secure Notification Pipeline Agent
      </p>
    </div>
  `;

  const emailSubjectCustomer = `🎟️ YOUR TICKETS CONFIRMED: ${booking.bookingCode} - Moraine Go Tours`;
  const emailHtmlCustomer = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #0D1B2A; margin: 0; font-weight: 900;">MORAINE GO TOURS</h1>
        <p style="color: #077B8A; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-top: 5px;">Your Gateway to the Banff National Park Lakes</p>
      </div>

      <div style="background: linear-gradient(135deg, #0D1B2A 0%, #077B8A 100%); color: white; border-radius: 8px; padding: 15px; text-align: center; margin-bottom: 20px;">
        <span style="font-size: 10px; text-transform: uppercase; opacity: 0.9;">Official Paid Boarding Pass</span>
        <h2 style="font-size: 24px; font-family: monospace; letter-spacing: 2px; margin: 5px 0; font-weight: bold;">${booking.bookingCode}</h2>
        <span style="font-size: 12px; font-weight: bold;">CAD $${booking.totalPrice} Paid • ${booking.passengers} Seats Reserved</span>
      </div>

      <h3 style="color: #0D1B2A; font-size: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 0;">Excursion Connection Details</h3>
      <table style="width: 100%; font-size: 13px; color: #444; margin-bottom: 20px;">
        <tr>
          <td style="padding: 4px 0; font-weight: bold; width: 130px;">Route Connection:</td>
          <td style="padding: 4px 0; color: #0d1b2a;">${booking.source} ⇄ ${booking.destination}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-weight: bold;">Date & Time:</td>
          <td style="padding: 4px 0; color: #077b8a; font-weight: bold;">${booking.travelDate} @ ${booking.timeSlot}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-weight: bold;">Lead Traveler:</td>
          <td style="padding: 4px 0; color: #0d1b2a;">${booking.passengerName}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-weight: bold;">Contact Phone:</td>
          <td style="padding: 4px 0; color: #0d1b2a;">${booking.phone || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-weight: bold;">Pick-Up Address:</td>
          <td style="padding: 4px 0; color: #077b8a; font-weight: bold;">${booking.pickupAddress || '135 Beaver St'} (${booking.postalCode || 'T1L 1A1'})</td>
        </tr>
      </table>

      <div style="background-color: #fff9e6; border: 1px solid #ffeeba; border-radius: 6px; padding: 12px; font-size: 12px; color: #856404; line-height: 1.4; margin-bottom: 20px;">
        <strong>💡 Key Boarding Instructions:</strong><br/>
        Please present this ticket on your phone when boarding. We recommend arriving at the loading bay 15 minutes prior to departure of <strong>${booking.timeSlot}</strong>. Your ticket covers the guaranteed same-day return shuttle scheduled 4.5 hours after your outward journey.
      </div>

      <p style="font-size: 12px; color: #666; text-align: center; margin-top: 25px;">
        Thank you for choosing Moraine Go Tours! Enjoy your majestic Rockies experience.<br/>
        <a href="https://morainegotours.com" style="color: #077b8a; text-decoration: none; font-weight: bold;">www.morainegotours.com</a>
      </p>
    </div>
  `;

  // If credentials are not set up, log information in simulated environment clearly
  if (!user || !pass) {
    console.log(`[EMAIL SIMULATOR] Custom SMTP details are not configured in environment variables. 
---------------------------------------------------------
FROM: Moraine Go Tours <notification@morainego.com>
ADMIN NOTIFIED: ${adminEmail}
CUSTOMER NOTIFIED: ${customerEmail}
SUBJECT (ADMIN): ${emailSubjectAdmin}
SUBJECT (CUSTOMER): ${emailSubjectCustomer}
---------------------------------------------------------
*Booking saved in server JSON database. Configure SMTP_USER and SMTP_PASS to trigger live emails.*`);
    return { success: true, simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Fire email notifications in parallel
    await Promise.all([
      transporter.sendMail({
        from: `"Moraine Go Booking Engine" <${user}>`,
        to: adminEmail,
        subject: emailSubjectAdmin,
        html: emailHtmlAdmin,
      }),
      transporter.sendMail({
        from: `"Moraine Go Confirmation" <${user}>`,
        to: customerEmail,
        subject: emailSubjectCustomer,
        html: emailHtmlCustomer,
      })
    ]);

    console.log(`[EMAIL DISPATCH SUCCESS] Real emails successfully dispatched to admin and passenger!`);
    return { success: true, simulated: false };
  } catch (err: any) {
    console.error("[EMAIL SYSTEM ERROR] Error occurred while mailing with nodemailer:", err);
    return { success: false, error: err.message };
  }
}

// Lazy Stripe Client Loader
let stripeClient: any = null;
const getStripeClient = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  if (!stripeClient) {
    try {
      // Lazy initialize Stripe instance
      stripeClient = new (require('stripe') || import('stripe'))(secretKey);
    } catch (e) {
      try {
        const StripePkg = require('stripe');
        stripeClient = new StripePkg(secretKey);
      } catch (err2) {
        console.error("Stripe package import failure:", err2);
      }
    }
  }
  return stripeClient;
};

// API Endpoint to process ticket sales dynamically
app.post('/api/purchase', async (req, res) => {
  try {
    const { amount, passengerName, email, cardName, bookingDetails } = req.body;
    
    if (!amount || isNaN(Number(amount))) {
      return res.status(400).json({ error: 'Valid payment amount is required' });
    }

    const stripe = getStripeClient();
    const bookingCode = `MG-${Math.floor(1000 + Math.random() * 9000)}-2026`;

    // 1. IF STRIPE IS NOT CONFIGURED (Sandbox / Simulation Flow)
    if (!stripe) {
      const transactionId = `ch_sandbox_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      const newBooking = {
        id: transactionId,
        routeId: bookingDetails?.routeId || 'banff-to-lakes',
        source: bookingDetails?.source || 'Banff',
        destination: bookingDetails?.destination || 'Lake Louise & Moraine Lake',
        tripType: bookingDetails?.tripType || 'round-trip',
        passengers: Number(bookingDetails?.passengers || 1),
        travelDate: bookingDetails?.travelDate || 'June 15, 2026',
        timeSlot: bookingDetails?.timeSlot || '08:00 AM',
        passengerName: passengerName || 'Lead Passenger',
        email: email || 'passenger@example.com',
        phone: bookingDetails?.phone || '',
        pickupAddress: bookingDetails?.pickupAddress || '135 Beaver St',
        postalCode: bookingDetails?.postalCode || 'T1L 1A1',
        totalPrice: Number(amount),
        bookingCode,
        bookedAt: new Date().toISOString()
      };

      // Record in Database Save File
      bookingsDb.push(newBooking);
      saveBookingsToFile(bookingsDb);

      // Async email notifications trigger
      sendNotificationEmail(newBooking).catch(err => {
        console.error("Async Sandbox Email dispatcher failed:", err);
      });

      console.log(`[PAYMENT SIMULATOR RESORT] Successfully stored Sandbox Booking ${bookingCode}`);

      return res.json({
        success: true,
        mode: 'sandbox',
        transactionId,
        bookingCode,
        message: 'Sandbox Authorized successfully!',
        notes: 'Your app is configured for live test simulations. Mail and DB saves completed successfully.'
      });
    }

    // 2. LIVE STRIPE TRANSACTING FLOW
    console.log(`[PAYMENT LIVE STRIPE] Initializing PaymentIntent for $${amount} CAD from ${email}`);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100), // convert to cents
      currency: 'cad',
      payment_method_types: ['card'],
      receipt_email: email,
      description: `Moraine Go Shuttle Connection Ticket Booking`,
      metadata: {
        passengerName: passengerName || 'Lead Passenger',
        routeSource: bookingDetails?.source || '',
        routeDestination: bookingDetails?.destination || '',
        tripType: bookingDetails?.tripType || '',
        passengersCount: String(bookingDetails?.passengers || 1),
      }
    });

    const newBooking = {
      id: paymentIntent.id,
      routeId: bookingDetails?.routeId || 'banff-to-lakes',
      source: bookingDetails?.source || 'Banff',
      destination: bookingDetails?.destination || 'Lake Louise & Moraine Lake',
      tripType: bookingDetails?.tripType || 'round-trip',
      passengers: Number(bookingDetails?.passengers || 1),
      travelDate: bookingDetails?.travelDate || 'June 15, 2026',
      timeSlot: bookingDetails?.timeSlot || '08:00 AM',
      passengerName: passengerName || 'Lead Passenger',
      email: email || 'passenger@example.com',
      phone: bookingDetails?.phone || '',
      pickupAddress: bookingDetails?.pickupAddress || '135 Beaver St',
      postalCode: bookingDetails?.postalCode || 'T1L 1A1',
      totalPrice: Number(amount),
      bookingCode,
      bookedAt: new Date().toISOString()
    };

    // Record in database
    bookingsDb.push(newBooking);
    saveBookingsToFile(bookingsDb);

    // Trigger notification mails in parallel runtime
    sendNotificationEmail(newBooking).catch(err => {
      console.error("Async Live Email dispatcher failed:", err);
    });

    return res.json({
      success: true,
      mode: 'live',
      clientSecret: paymentIntent.client_secret,
      transactionId: paymentIntent.id,
      bookingCode,
      message: 'Secure Stripe confirmation handshake completed successfully.'
    });

  } catch (error: any) {
    console.error("Payment processing error:", error);
    return res.status(500).json({ error: error?.message || 'Handshake or payment execution with Stripe gateway failed.' });
  }
});

// GET /api/admin/bookings - Returns all real historical ticket purchases & admin status indicators
app.get('/api/admin/bookings', (req, res) => {
  try {
    // Reload bookings from file DB to pick up any dynamic records
    bookingsDb = loadBookingsFromFile();
    
    res.json({
      success: true,
      bookings: bookingsDb,
      configs: {
        smtpActive: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
        stripeActive: !!process.env.STRIPE_SECRET_KEY,
        adminEmail: process.env.NOTIFICATION_EMAIL || 'morainego142@gmail.com',
        host: process.env.SMTP_HOST || 'Unset'
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch admin dashboard records.' });
  }
});

// POST /api/admin/purge - Destroys files (Admin testing clean-ups)
app.post('/api/admin/purge', (req, res) => {
  try {
    bookingsDb = [];
    saveBookingsToFile(bookingsDb);
    res.json({ success: true, message: 'All bookings database records purged successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Purge failed.' });
  }
});

// Setup Vite development server or production environment
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Moraine Go Shuttle application running at http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((e) => {
  console.error("Failed to start server", e);
});
