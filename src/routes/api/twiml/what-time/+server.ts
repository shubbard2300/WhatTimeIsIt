import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const twiml = `
    <Response>
      <Pause length="1" />
      <Say voice="alice">
        Hello.
      </Say>
      <Pause length="1" />
      <Say voice="alice">
        Just a little voice,
        calling to ask one small, slippery question.
      </Say>
      <Pause length="1" />
      <Say voice="alice">
        What time is it?
      </Say>
      <Pause length="1" />
      <Say voice="alice">
        Not just on the clock—
        in your head,
        in your day,
        in your life.
      </Say>
      <Pause length="1" />
      <Say voice="alice">
        Think about it.
        What time… is it?
      </Say>
    </Response>
  `.trim();

  return new Response(twiml, {
    headers: {
      'Content-Type': 'text/xml'
    }
  });
};
