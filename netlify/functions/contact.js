// netlify/functions/contact.js
const { Pool } = require('pg');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const formData = new URLSearchParams(event.body);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // Validate input
  if (!name || !email || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Jméno, e-mail a zpráva jsou povinné." }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  let pool;
  try {
    // Use NETLIFY_DATABASE_URL for connection
    const connectionString = process.env.NETLIFY_DATABASE_URL;
    if (!connectionString) {
      throw new Error('NETLIFY_DATABASE_URL is not set.');
    }

    pool = new Pool({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false, // Required for Neon DB on Netlify
      },
    });

    // Insert data into the database
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO contact_messages (name, email, message)
        VALUES ($1, $2, $3)
      `;
      await client.query(query, [name, email, message]);
      console.log('Message saved to database.');
    } finally {
      client.release();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Děkujeme za vaši zprávu. Brzy se vám ozveme!" }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Error processing form:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Omlouváme se, došlo k chybě. Zkuste to prosím později." }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } finally {
    if (pool) {
      await pool.end(); // Close the pool after the request is handled
    }
  }
};