import { useState, useRef } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";

const ProductItemWrapper = styled.div`
  word-break: break-all;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 1rem;
  &:hover {
    cursor: pointer;
  }

  & .user-description p {
    margin: 0px;
  }

  & .product-name {
    font-size: 22px;
  }

  & img {
    width: 100%;
  }

  & .price,
  & .btn-wrapper {
    text-align: end;
    justify-self: flex-end;
  }

  & .btn-wrapper button {
    margin-left: 5px;
  }

  & .textarea {
    width: 100%;
    margin-bottom: 10px;
  }
`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ProductItem = (props) => {
  const [cookies] = useCookies();
  const [editMode, setEditMode] = useState(false);
  const updateText = useRef();

  const editHandler = () => setEditMode((prev) => !prev);

  const coupangHandler = () => {
    if (editMode) {
      return;
    }
    window.location.href = props.affiliate_url;
  };

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
    <ProductItemWrapper className="border">
      <div onClick={coupangHandler} id={props.id}>
        <div>
          <img alt="product-img" src={props.image_url} />
          <p>
            <b className="product-name">{props.name}</b>
          </p>
          <div className="price">
            <p>{Number(props.price).toLocaleString("ko-KR")}원</p>
          </div>
          <div className="user-description">
            <p>
              <b>{props.username}</b>
            </p>
            {editMode ? (
              <textarea
                className="card-text textarea"
                defaultValue={props.description}
                ref={updateText}
              />
            ) : (
              <div className="review">
                <p className="card-text">{props.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {editMode && cookies.token ? (
        <div className="btn-wrapper">
          <button className="btn-small" onClick={editHandler}>
            취소
          </button>
          <button
            className="btn-small"
            onClick={updateProductHandler.bind(null, props.id)}
          >
            저장
          </button>
        </div>
      ) : cookies.token ? (
        <div className="btn-wrapper">
          <button className="btn-small" onClick={editHandler}>
            수정
          </button>
          <button
            className="btn-small btn-danger-outline"
            onClick={deleteProductHandler.bind(null, props.id)}
          >
            삭제
          </button>
        </div>
      ) : null}
    </ProductItemWrapper>
  );
};

export default ProductItem;
