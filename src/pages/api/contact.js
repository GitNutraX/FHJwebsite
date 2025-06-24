export async function post({ request }) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Call Netlify Function to send email
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    });

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.status}`);
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
  }
}
