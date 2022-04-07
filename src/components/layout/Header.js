import { Link } from "react-router-dom";
import styled from "styled-components";
import { useContext } from "react";
import CategoryContext from "../../store/CategoryContext";

const HeaderWrapper = styled.div`
  display: flex;
  text-align: center;
  position: relative;
  margin-bottom: 20px;

  a {
    text-decoration: none;
    color: black;
  }

  & .title {
    width: 100%;
  }

  & .logout {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  & .logout button {
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
  }

  & .logout button:hover {
    cursor: pointer;
  }
`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Header = ({ cookies, removeCookie }) => {
  const { selectCategory } = useContext(CategoryContext);

  const homeHandler = () => {
    selectCategory("");
  };

  const logoutHandler = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/sign_out`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cookies.token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      removeCookie("token", { path: "/" });
      removeCookie("refreshToken", { path: "/" });
      removeCookie("username", { path: "/" });
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <HeaderWrapper>
      <div className="title">
        <Link to="/" onClick={homeHandler}>
          <h1>쿠팡요정 람앤롭</h1>
        </Link>
        <h3>자취의 달인 람앤롭이 직접 써본 제품만을 소개합니다!</h3>
      </div>
      <div className="logout">
        {cookies.token && <button onClick={logoutHandler}>로그아웃</button>}
      </div>
    </HeaderWrapper>
  );
};

export default Header;
