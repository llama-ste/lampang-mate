import styled from "styled-components";
import { useCookies } from "react-cookie";

import Header from "./Header";
import Sidebar from "./Sidebar";

const LayoutWrapper = styled.div`
  & main {
    min-width: 1025px;
    display: flex;
  }

  & section {
    max-width: 1200px;
    width: 100%;
  }

  @media screen and (max-width: 1024px) {
    & main {
      min-width: 300px;
    }
  }

  @media screen and (max-width: 700px) {
    & .sidebar {
      display: none;
    }
  }
`;

const Layout = (props) => {
  const [cookies, , removeCookie] = useCookies();

  return (
    <LayoutWrapper>
      <main>
        <div className="sidebar">
          <Sidebar cookies={cookies} removeCookie={removeCookie} />
        </div>
        <section className="paper border">
          <Header cookies={cookies} removeCookie={removeCookie} />
          {props.children}
        </section>
      </main>
    </LayoutWrapper>
  );
};

export default Layout;
