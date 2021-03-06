import { useState, useEffect, useContext, useRef } from "react";
import styled from "styled-components";
import ProductItem from "./ProductItem";
import CategoryContext from "../store/CategoryContext";
// import Loader from "../UI/Loader";

const ProductListWrapper = styled.div`
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
  const [isLoaded, setIsLoaded] = useState(false);
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
        setIsLoaded(true);
        const response = await (await fetch(url)).json();
        if (response.pagination.is_last_page) {
          endRef.current = true;
        }
        console.log(response);
        if (page === 1) {
          setProducts([...response.products]);
        } else {
          setProducts((prev) => [...prev, ...response.products]);
        }

        setIsLoaded(false);
        setIsEmpty(false);
        preventRef.current = true;
      };

      fetchProducts();
    }
  }, [category, page, sort, completeChange, prevCategory, prevSort]);

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
      <div className="form-group">
        <select
          id="paperSelects1"
          className="border border-primary"
          onChange={sortHandler}
          value={sort}
        >
          <option value="latest">?????? ?????????</option>
          <option value="highest_price">?????? ?????????</option>
          <option value="lowest_price">?????? ?????????</option>
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
