import { useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const LoginWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;

  & .login-box {
    padding: 40px;
  }

  & header {
    text-align: center;
    margin-bottom: 25px;
  }

  & .input-box {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 25px;
  }

  & .btn-box {
    text-align: end;
  }
`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Login = () => {
  const [, setCookie] = useCookies();
  const navigete = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [check, setCheck] = useState(false); //FIXME staySignedIn
  const [error, setError] = useState("");

  const loginHanlder = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await (
        await fetch(`${API_BASE_URL}/auth/sign_in`, {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();

      const {
        token,
        refresh_token,
        token_expires,
        refresh_token_expires,
        name,
      } = response;

      const baseCookieOpt = {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      };

      const tokenCookieOpt = check
        ? { ...baseCookieOpt, expires: new Date(token_expires) }
        : baseCookieOpt;
      const refreshTokenCookieOpt = check
        ? { ...baseCookieOpt, expires: new Date(refresh_token_expires) }
        : baseCookieOpt;

      setCookie("token", token, tokenCookieOpt);
      setCookie("refreshToken", refresh_token, refreshTokenCookieOpt);
      setCookie("username", name, tokenCookieOpt);

      navigete("/", { replace: true });
    } catch (e) {
      setError(e.message);
      console.log(error);
    }
  };

  return (
    <LoginWrapper>
      <div className="login-box border">
        <header>
          <h3>Adminustrator Login</h3>
        </header>
        <form onSubmit={loginHanlder}>
          <div className="input-box">
            <input type="email" required placeholder="Id" ref={emailRef} />
            <input
              type="password"
              required
              placeholder="Password"
              ref={passwordRef}
            />
          </div>
          <div className="form-group">
            <label htmlFor="paperChecks1" className="paper-check">
              <input
                id="paperChecks1"
                name="paperChecks"
                type="checkbox"
                value={check}
                onChange={() => setCheck((prev) => !prev)}
              />
              <span>자동 로그인 하기</span>
            </label>
          </div>
          <div className="btn-box">
            <button>
              <b>Sign In</b>
            </button>
          </div>
        </form>
      </div>
    </LoginWrapper>
  );
};

export default Login;
