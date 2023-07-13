import '../global.css'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
  <>
    <GoogleReCaptchaProvider reCaptchaKey='6LeuLR4nAAAAAOXmMeOFZbK9SX4c-ENxmQZQ-uHz'>    
      <Component {...pageProps} />
    </GoogleReCaptchaProvider>
  </>);
}
