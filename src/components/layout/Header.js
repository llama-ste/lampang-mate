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
          <h3>λν‘π¦</h3>
        </Link>
        <p>μμ·¨μ λ¬μΈ λΌλ§κ° μ§μ  μ¨λ³Έ μ νλ§μ μκ°ν©λλ€!</p>
      </div>
    </HeaderWrapper>
  );
};

export default Header;
