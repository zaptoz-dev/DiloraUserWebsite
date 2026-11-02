import { Link } from 'react-router-dom';
import LegalPage from '../components/legal/LegalPage';

export default function Dpa() {
  return (
    <LegalPage title="Data Processing Agreement" lastUpdated="3 November 2026">
      <p>
        This page summarises how Zaptoz Technologies Private Limited ("Zaptoz") handles personal data for businesses
        that use the Audeora product. It is a summary, not the agreement itself.
      </p>

      <h2>Processing on behalf of customers</h2>
      <p>
        When a business uses the Audeora product, Zaptoz processes personal data on that customer's behalf and on its
        instructions. In the terms of India's Digital Personal Data Protection Act, 2023, the customer is the data
        fiduciary and Zaptoz acts as its data processor.
      </p>
      <p>
        This processing is covered by a Data Processing Agreement (DPA), which forms part of the customer's contract
        with Zaptoz.
      </p>

      <h2>Subprocessors for customer deployments</h2>
      <p>
        The subprocessors used for a customer deployment depend on how that deployment is configured. They are listed
        in the signed DPA for that customer.
      </p>

      <h2>Requesting a copy</h2>
      <p>
        A signed copy of the DPA is available on request. To ask for one, email{' '}
        <a href="mailto:info@zaptoz.com">info@zaptoz.com</a>.
      </p>

      <h2>Service providers used by this website</h2>
      <p>
        Separately from customer deployments, this website and its demos use the service providers below. This is not
        a list of subprocessors for the Audeora product.
      </p>
      <ul>
        <li>
          <strong>Bolna (bolna.ai):</strong> places the outbound demo call requested through the demo form, with its
          telephony partners.
        </li>
        <li>
          <strong>Deepgram:</strong> converts speech to text in the live voice demo.
        </li>
        <li>
          <strong>Amazon Web Services:</strong> hosts the website in the Asia Pacific (Hyderabad) region, generates
          the live demo's replies through Amazon Bedrock (using an Anthropic Claude model), and provides Amazon Polly
          as a backup voice.
        </li>
        <li>
          <strong>ElevenLabs:</strong> turns the live demo's reply text into speech.
        </li>
        <li>
          <strong>Sarvam AI:</strong> backup text to speech for the live demo.
        </li>
        <li>
          <strong>Google Fonts:</strong> serves the fonts used on the website.
        </li>
      </ul>
      <p>
        Our <Link to="/privacy">Privacy Policy</Link> explains what data the website and its demos collect and how it
        is used.
      </p>
    </LegalPage>
  );
}
