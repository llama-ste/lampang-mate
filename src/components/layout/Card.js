import styled from "styled-components";

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  border: 1px solid black;
  border-radius: 10px;
  height: 452px;
  padding: 15px;

  &:hover {
    cursor: pointer;
  }
`;

const Card = (props) => {
  return <CardWrapper>{props.children}</CardWrapper>;
};

export default Card;
