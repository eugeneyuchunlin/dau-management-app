import Nvbar from './components/nvbar';
import LoginForm  from './components/LoginForm';
import { LoginProvider } from './contexts/LoginContext';



export default function Login() {
    return (
        <>
            <LoginProvider>
                <Nvbar />
                <LoginForm />
            </LoginProvider>
        </>
    )
}