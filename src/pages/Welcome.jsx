import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { LuLogIn, LuUserPlus, LuArrowLeft } from 'react-icons/lu';
import { auth } from '../../firebase.js';

const style = {
  container: `bg-base-200 max-w-[358px] text-center w-full m-auto rounded-lg shadow-xl p-5`,
  formContainer: `flex flex-col items-center justify-center`,
  heading: `text-2xl font-bold  text-gray-800 p-2.5 uppercase`,
  subHeading: `text-xl text-gray-800 p-2.5`,
  formControl: `form-control w-full max-w-xs`,
  labelText: `label-text`,
  label: `label`,
  input: `input input-bordered shadow-md w-full max-w-xs`,
  signInButton: `btn btn-primary mt-4`,
  secondSubHeading: `text-xl text-gray-800 p-2.5 mt-4`,
  createAccountButton: `btn btn-outline btn-primary ml-auto mr-auto`,
  registerButton: `btn btn-primary mt-4`,
  goBackButton: `btn btn-outline btn-primary mt-4`,
};

const buttonSmall = 20;

export default function Welcome() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerInformation, setRegisterInformation] = useState({
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const signInRef = useRef();
  const registerRef = useRef();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/homepage');
      }
    });
  }, []);

  useEffect(() => {
    isRegistering ? registerRef.current.focus() : signInRef.current.focus();
  }, [isRegistering]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/homepage');
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (registerInformation.email !== registerInformation.confirmEmail) {
      alert('Please confirm that email are the same');
      return;
    }

    if (registerInformation.password !== registerInformation.confirmPassword) {
      alert('Please confirm that password are the same');
      return;
    }

    createUserWithEmailAndPassword(
      auth,
      registerInformation.email,
      registerInformation.password,
    )
      .then(() => {
        navigate('/homepage');
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className={style.container}>
      <h1 className={style.heading}>Shopping List</h1>
      <div className={style.formContainer}>
        {isRegistering ? (
          <>
            <h2 className={style.subHeading}>Registration</h2>
            <form>
              <div className={style.formControl}>
                <label
                  className={style.label}
                  htmlFor="email"
                >
                  <span className={style.labelText}>Email Address</span>
                </label>
                <input
                  className={style.input}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={registerInformation.email}
                  ref={registerRef}
                  onChange={(e) =>
                    setRegisterInformation({
                      ...registerInformation,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className={style.formControl}>
                <label
                  className={style.label}
                  htmlFor="emailConfirm"
                >
                  <span className={style.labelText}>Confirm Email Address</span>
                </label>
                <input
                  className={style.input}
                  id="emailConfirm"
                  type="email"
                  placeholder="Enter your email"
                  value={registerInformation.confirmEmail}
                  onChange={(e) =>
                    setRegisterInformation({
                      ...registerInformation,
                      confirmEmail: e.target.value,
                    })
                  }
                />
              </div>
              <div className={style.formControl}>
                <label
                  className={style.label}
                  htmlFor="password"
                >
                  <span className={style.labelText}>Password</span>
                </label>
                <input
                  className={style.input}
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={registerInformation.password}
                  onChange={(e) =>
                    setRegisterInformation({
                      ...registerInformation,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <div className={style.formControl}>
                <label
                  className={style.label}
                  htmlFor="passwordConfirm"
                >
                  <span className={style.labelText}>Confirm Password</span>
                </label>
                <input
                  className={style.input}
                  id="passwordConfirm"
                  type="password"
                  placeholder="Enter your password"
                  value={registerInformation.confirmPassword}
                  onChange={(e) =>
                    setRegisterInformation({
                      ...registerInformation,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
              <button
                className={style.registerButton}
                onClick={handleRegister}
              >
                <LuUserPlus size={buttonSmall} />
                Register
              </button>
            </form>
            <button
              className={style.goBackButton}
              onClick={() => setIsRegistering(false)}
            >
              <LuArrowLeft size={buttonSmall} />
              Go Back
            </button>
          </>
        ) : (
          <>
            <h2 className={style.subHeading}>Please, sign in</h2>
            <form>
              <div className={style.formControl}>
                <label
                  className={style.label}
                  htmlFor="email"
                >
                  <span className={style.labelText}>Email Address</span>
                </label>
                <input
                  className={style.input}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  onChange={handleEmailChange}
                  value={email}
                  ref={signInRef}
                />
              </div>
              <div className={style.formControl}>
                <label
                  className={style.label}
                  htmlFor="password"
                >
                  <span className={style.labelText}>Password</span>
                </label>
                <input
                  className={style.input}
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  onChange={handlePasswordChange}
                  value={password}
                />
              </div>
              <button
                className={style.signInButton}
                onClick={handleSignIn}
                title="Sign In"
              >
                <LuLogIn size={buttonSmall} />
                Sign In
              </button>
            </form>
            <div>
              <h2 className={style.secondSubHeading}>Don't have an account?</h2>
              <button
                className={style.createAccountButton}
                onClick={() => setIsRegistering(true)}
              >
                <LuUserPlus size={buttonSmall} />
                Sign Up
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
