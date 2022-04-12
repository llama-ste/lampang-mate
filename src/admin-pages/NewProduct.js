import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useCookies } from "react-cookie";

const NewProductWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  & .container {
    width: 50%;
  }

  & .input-box {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
  }

  & .error {
    color: red;
  }

  & textarea {
    margin-top: 5px;
    width: 100%;
  }

  & .btn-wrapper {
    margin-top: 30px;
    text-align: center;
  }

  & select {
    width: 30%;
    margin-top: 5px;
    margin-bottom: 20px;
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
        },
      }
    );

    console.log(response);

    console.log(response.body);

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      setError(data.message);
    } else {
      setLoadedInfo({ ...data });
      setIsComplete(true);
    }
  };

  return (
    <NewProductWrapper>
      <h3>제품 추가</h3>
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
            <div>
              <img src={loadedInfo.image_url} alt="loadedImage" />
              <h4>{loadedInfo.name}</h4>
              <h4>{Number(loadedInfo.price).toLocaleString("ko-KR")}원</h4>
            </div>
            <div>
              <label htmlFor="option">카테고리</label>
              <select id="option" onChange={selectCategoryHandler}>
                {options}
              </select>
              <label htmlFor="description">리뷰</label>
              <textarea
                id="description"
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
