import { Pool } from 'pg';

export async function post({ request }) {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // Validate input
  if (!name || !email || !message) {
    return new Response(JSON.stringify({
      message: "Jméno, e-mail a zpráva jsou povinné."
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
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

    return new Response(JSON.stringify({
      message: "Děkujeme za vaši zprávu. Brzy se vám ozveme!"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error('Error processing form:', error);
    return new Response(JSON.stringify({
      message: "Omlouváme se, došlo k chybě. Zkuste to prosím později."
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } finally {
    if (pool) {
      await pool.end(); // Close the pool after the request is handled
    }
  }
}
