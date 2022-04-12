import { Link } from "react-router-dom";
import styled from "styled-components";
import { useContext } from "react";
import CategoryContext from "../../store/CategoryContext";

const HeaderWrapper = styled.div`
  display: flex;
  text-align: center;
  position: relative;
  margin-bottom: 20px;

  & .title {
    width: 100%;
  }
`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Header = ({ cookies }) => {
  const { selectCategory } = useContext(CategoryContext);

  const homeHandler = () => {
    selectCategory("");
  };

  return (
    <HeaderWrapper>
      <div className="title">
        <Link to="/" onClick={homeHandler}>
          <h3>람팡🦙</h3>
        </Link>
        <p>자취의 달인 라마가 직접 써본 제품만을 소개합니다!</p>
      </div>
    </HeaderWrapper>
  );
};

export default Header;
