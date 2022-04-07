import { useState, useEffect, useContext, useRef } from "react";
import styled from "styled-components";
import ProductItem from "./ProductItem";
import CategoryContext from "../store/CategoryContext";
// import Loader from "../UI/Loader";

const ProductListWrapper = styled.div`
  & .sort {
    text-align: end;
    margin-bottom: 25px;
  }

  & select {
    padding: 10px;
    border: none;
    background-color: #f1f2f4;
    border-radius: 5px;
  }

  & select:hover {
    cursor: pointer;
  }

  & .item-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: auto;
    gap: 15px;
  }

  & .loader {
    margin-top: 20px;
    text-align: center;
  }

  @media screen and (max-width: 1200px) {
    & .item-wrapper {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media screen and (max-width: 1024px) {
    & .item-wrapper {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media screen and (max-width: 500px) {
    & .item-wrapper {
      grid-template-columns: repeat(1, 1fr);
    }
  }
`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isLoaded, setIdLoaded] = useState(false);
  const [sort, setSort] = useState("latest");
  const [prevSort, setPrevSort] = useState(sort);
  const { category, prevCategory, completeChange } =
    useContext(CategoryContext);

  const [page, setPage] = useState(1);
  const observerRef = useRef(true);
  const preventRef = useRef(true);
  const endRef = useRef(false);

  useEffect(() => {
    if (category !== prevCategory) {
      setPage(1);
      setIsEmpty(true);
      setProducts([]);
      setSort("latest");
      setPrevSort("latest");
      endRef.current = false;
      completeChange();
    } else if (sort !== prevSort) {
      setPage(1);
      setIsEmpty(true);
      setProducts([]);
      endRef.current = false;
      setPrevSort(sort);
    }

    let url =
      category === ""
        ? `${API_BASE_URL}/products?page=${page}&order=${sort}`
        : `${API_BASE_URL}/categories/${category}/products?page=${page}&order=${sort}`;

    if (category === prevCategory && sort === prevSort) {
      const fetchProducts = async () => {
        setIdLoaded(true);
        const response = await (await fetch(url)).json();
        if (response.pagination.is_last_page) {
          endRef.current = true;
        }

        setProducts((prev) => [...prev, ...response.products]);
        setIdLoaded(false);
        setIsEmpty(false);
        preventRef.current = true;
      };

      fetchProducts();
    }
  }, [category, page, completeChange, prevSort, sort, prevCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(obsHandler, { threshold: 1 });
    if (observerRef.current && !isEmpty) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isEmpty]);

  const obsHandler = (entries) => {
    const target = entries[0];
    if (!endRef.current && target.isIntersecting && preventRef.current) {
      preventRef.current = false;
      setPage((prev) => (prev += 1));
    }
  };

  const sortHandler = (e) => {
    const selected = e.target.value;
    setSort(selected);
  };

  const deleteProductHandler = (id) => {
    setProducts((prev) => {
      const updatedProducts = prev.filter((prev) => {
        return prev.id !== id;
      });

      return updatedProducts;
    });
  };

  const updateProductHandler = (targetId, newDescription) => {
    setProducts((prev) => {
      const updatedProducts = prev.map((product) => {
        return product.id === targetId
          ? { ...product, description: newDescription }
          : product;
      });

      return updatedProducts;
    });
  };

  const product = products.map((product) => {
    return (
      <ProductItem
        key={product.id}
        id={product.id}
        image_url={product.image_url}
        name={product.name}
        price={product.price}
        username={product.user.name}
        description={product.description}
        affiliate_url={product.affiliate_url}
        deleteProduct={deleteProductHandler}
        updateProduct={updateProductHandler}
      />
    );
  });

  return (
    <ProductListWrapper>
      <div className="sort">
        <select onChange={sortHandler} value={sort}>
          <option value="latest">최신 등록순</option>
          <option value="highest_price">가격 높은순</option>
          <option value="lowest_price">가격 낮은순</option>
        </select>
      </div>
      {!isEmpty && <div className="item-wrapper">{product}</div>}
      <div className="loader" ref={observerRef}>
        {isLoaded && "Loading..."}
      </div>
    </ProductListWrapper>
  );
};

export default ProductList;
