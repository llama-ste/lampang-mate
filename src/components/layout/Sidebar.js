import { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";
import Category from "../Categoty";

const SidebarWrapper = styled.div`
  margin-top: 15vh;
  width: 250px;
  margin-right: 50px;

  &:hover {
    cursor: pointer;
  }

  & .categories {
    margin: 20px 0px;
  }

  & .category {
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px 0px;
    margin: 10px 0px;
    position: relative;
  }

  & .category-form {
    text-align: center;
  }

  & .category-form p {
    margin: 0px 0px 5px 0px;
  }

  & .category-form input {
    margin-right: 5px;
  }

  & .category-name-edit-wrapper {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  & .btn-wrapper {
    text-align: center;
    margin-bottom: 20px;
  }

  & .btn-wrapper a,
  & .btn-wrapper button {
    text-decoration: none;
    color: black;
    border: 1px solid black;
    padding: 10px 20px;
    border-radius: 5px;
    background-color: white;
  }

  & button:hover {
    cursor: pointer;
  }
`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Sidebar = ({ cookies }) => {
  const [categories, setCategories] = useState([]);
  const [editCategoryOrder, setEditCategoryOrder] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState(false);
  const [reloadCategory, setReloadCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await (await fetch(`${API_BASE_URL}/categories`)).json();

      setCategories(response.categories);
    };

    fetchCategory();
  }, [reloadCategory]);

  const reloadHandler = () => {
    setReloadCategory((prev) => !prev);
  };

  const addCategoryHandler = async (e) => {
    e.preventDefault();

    await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookies.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: categoryName,
      }),
    });

    setCategoryName("");

    reloadHandler();
  };

  const editCategoryNameHandler = () => {
    setEditCategoryName((prev) => !prev);
  };

  const editCategoryHandler = () => {
    setEditCategoryOrder(true);
  };

  const cancelEditHandler = () => {
    setEditCategoryOrder(false);
    // FIXME! need refactor
    reloadHandler();
  };

  const sortedCategoryHandler = async () => {
    const idList = categories.map((category) => {
      return category.id;
    });

    await fetch(`${API_BASE_URL}/categories/order`, {
      method: "POST",
      body: JSON.stringify({
        ids: idList,
      }),
      headers: {
        Authorization: `Bearer ${cookies.token}`,
        "Content-Type": "application/json",
      },
    });

    setEditCategoryOrder(false);
  };

  return (
    <SidebarWrapper>
      {categories.length > 0 && (
        <ReactSortable
          className="categories"
          list={categories}
          setList={setCategories}
          animation={300}
          delayOnTouchOnly={true}
          disabled={editCategoryOrder ? false : true}
        >
          {categories.map((category) => {
            return (
              <Category
                key={category.id}
                cookies={cookies}
                reload={reloadHandler}
                category={category}
                editCategoryName={editCategoryName}
              />
            );
          })}
        </ReactSortable>
      )}
      {editCategoryName && (
        <div>
          <div className="category">
            <form className="category-form" onSubmit={addCategoryHandler}>
              <p>카테고리 추가</p>
              <input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category Name"
              />
              <button>추가</button>
            </form>
          </div>
          <div className="btn-wrapper">
            <button onClick={editCategoryNameHandler}>카테고리 수정완료</button>
          </div>
        </div>
      )}
      {!editCategoryName && !editCategoryOrder && (
        <div className="btn-wrapper">
          <button onClick={editCategoryNameHandler}>카테고리 관리</button>
        </div>
      )}
      {editCategoryOrder ? (
        <div className="btn-wrapper">
          <button onClick={cancelEditHandler}>취소</button>
          <button onClick={sortedCategoryHandler}>수정</button>
        </div>
      ) : (
        !editCategoryName && (
          <div className="btn-wrapper">
            <button onClick={editCategoryHandler}>
              카테고리 순서 변경하기
            </button>
          </div>
        )
      )}
      <div className="btn-wrapper">
        {cookies.token && !editCategoryOrder && !editCategoryName && (
          <Link to="/admin/new-product">새 제품 추가</Link>
        )}
      </div>
    </SidebarWrapper>
  );
};

export default Sidebar;
