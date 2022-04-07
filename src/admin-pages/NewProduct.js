import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useCookies } from "react-cookie";

const NewProductWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;

  & .container {
    width: 50%;
  }

  & .product-box {
    display: flex;
    gap: 30px;
  }

  & .input-box {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
  }

  & .input-box input {
    padding: 10px;
    border-radius: 10px;
    border: 1px solid lightgray;
  }

  & .input-box img {
    width: min-content;
  }

  & .error {
    color: red;
  }

  & button {
    padding: 10px 30px;
    margin-right: 10px;
    border: 1px solid black;
    background: none;
    border-radius: 10px;
  }

  & button:hover {
    cursor: pointer;
  }

  & .btn-wrapper {
    margin-top: 30px;
    text-align: center;
  }
`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const NewProduct = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const [isComplete, setIsComplete] = useState(false);
  const urlRef = useRef();
  const [loadedInfo, setLoadedInfo] = useState({});
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState();
  const descriptionRef = useRef();

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await (await fetch(`${API_BASE_URL}/categories`)).json();

      setCategories(response.categories);
      setSelectCategory(response.categories[0].id);
    };

    fetchCategory();
  }, []);

  const options = categories.map((category) => {
    return (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    );
  });

  const selectCategoryHandler = (e) => {
    setSelectCategory(e.target.value);
  };

  const addProductHandler = async (e) => {
    e.preventDefault();

    await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      body: JSON.stringify({
        category_id: selectCategory,
        image_url: loadedInfo.image_url,
        name: loadedInfo.name,
        price: loadedInfo.price,
        affiliate_url: loadedInfo.affiliate_url,
        description: descriptionRef.current.value,
      }),
      headers: {
        Authorization: `Bearer ${cookies.token}`,
        "Content-Type": "application/json",
      },
    });

    navigate("/", { replace: true });
  };

  const lookUpHandler = async () => {
    const url = encodeURIComponent(urlRef.current.value);

    const response = await fetch(
      `${API_BASE_URL}/products/affiliate_info/${url}`,
      {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
    } else {
      setLoadedInfo({ ...data });
      setIsComplete(true);
    }
  };

  return (
    <NewProductWrapper>
      <h1>제품 추가</h1>
      <div className="container">
        {!isComplete && (
          <div>
            <div className="input-box">
              <label htmlFor="product">Coupang URL</label>
              <input
                ref={urlRef}
                id="product"
                type="url"
                placeholder="Coupang URL"
              />
              {error && <p className="error">{error}</p>}
            </div>
            <div>
              <button onClick={lookUpHandler}>조회하기</button>
            </div>
          </div>
        )}
        {isComplete && (
          <form onSubmit={addProductHandler}>
            <div className="product-box">
              <div>
                <img src={loadedInfo.image_url} alt="loadeaImage" />
              </div>
              <div>
                <h2>{loadedInfo.name}</h2>
                <h4>{Number(loadedInfo.price).toLocaleString("ko-KR")}원</h4>
              </div>
            </div>
            <div>
              <select onChange={selectCategoryHandler}>{options}</select>
              <label>리뷰</label>
              <textarea
                required
                ref={descriptionRef}
                maxLength="150"
              ></textarea>
            </div>
            <div className="btn-wrapper">
              <button>등록</button>
            </div>
          </form>
        )}
      </div>
    </NewProductWrapper>
  );
};

export default NewProduct;
