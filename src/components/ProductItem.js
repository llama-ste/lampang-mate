import { useState, useRef } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import Card from "./layout/Card";

const ProductItemWrapper = styled.div`
  word-break: break-all;

  & img {
    width: 100%;
  }

  & a {
    text-decoration: none;
    color: black;
  }

  & p,
  & h3 {
    margin: 5px 0px 0px 0px;
  }

  & br {
    border: 1px solid black;
  }

  & .price {
    text-align: end;
  }

  & .btn-wrapper {
    text-align: end;
  }

  & .btn-wrapper button {
    padding: 5px 10px;
    margin-left: 5px;
  }
`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ProductItem = (props) => {
  const [cookies] = useCookies();
  const [editMode, setEditMode] = useState(false);
  const updateText = useRef();

  const editHandler = () => setEditMode((prev) => !prev);

  const updateProductHandler = async (id) => {
    const currText = updateText.current.value;

    await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${cookies.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: currText,
      }),
    });

    props.updateProduct(id, currText);
    setEditMode(false);
  };

  const deleteProductHandler = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cookies.token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      props.deleteProduct(id);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <Card>
      <ProductItemWrapper>
        <a href={editMode ? "#" : props.affiliate_url} id={props.id}>
          <img alt="product-img" src={props.image_url} />
          <div className="name">
            <p>{props.name}</p>
          </div>
          <div className="price">
            <span>{Number(props.price).toLocaleString("ko-KR")}원</span>
          </div>
          <hr />
          <b>{props.username}</b>
          {editMode ? (
            <textarea defaultValue={props.description} ref={updateText} />
          ) : (
            <div className="review">
              <p>{props.description}</p>
            </div>
          )}
        </a>

        {editMode ? (
          <div className="btn-wrapper">
            <button onClick={editHandler}>취소</button>
            <button onClick={updateProductHandler.bind(null, props.id)}>
              저장
            </button>
          </div>
        ) : (
          <div className="btn-wrapper">
            <button onClick={editHandler}>수정</button>
            <button onClick={deleteProductHandler.bind(null, props.id)}>
              삭제
            </button>
          </div>
        )}
      </ProductItemWrapper>
    </Card>
  );
};

export default ProductItem;
