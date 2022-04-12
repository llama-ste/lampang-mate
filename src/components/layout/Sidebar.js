import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";

import Category from "../Categoty";
import CategoryContext from "../../store/CategoryContext";

const SidebarWrapper = styled.div`
  margin-top: 15vh;
  width: 250px;
  margin-right: 50px;

  & .categories {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 20px 0px;
  }

  & .category-form {
    text-align: center;
  }

  & .category-form p {
    margin: 30px 0px 0px 0px;
  }

  & input {
    width: 100%;
    margin: 10px 0px;
  }

  & .btn-wrapper {
    text-align: center;
    margin-bottom: 10px;
  }
`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Sidebar = ({ cookies, removeCookie }) => {
  const [categories, setCategories] = useState([]);
  const [editCategoryOrder, setEditCategoryOrder] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState(false);
  const [reloadCategory, setReloadCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const { selectCategory } = useContext(CategoryContext);

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

  const editCategoryOrderHandler = () => {
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

  const logoutHandler = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/sign_out`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cookies.token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      removeCookie("token", { path: "/" });
      removeCookie("refreshToken", { path: "/" });
      removeCookie("username", { path: "/" });
    } catch (e) {
      console.log(e.message);
    }
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
          <button
            onClick={() => {
              selectCategory("");
            }}
            className="btn-block"
          >
            <b>전체보기</b>
          </button>
          {categories.map((category) => {
            return (
              <Category
                key={category.id}
                cookies={cookies}
                reload={reloadHandler}
                category={category}
                editCategoryName={editCategoryName}
                editCategoryOrder={editCategoryOrder}
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
              <div className="btn-wrapper">
                <button className="btn-small">추가</button>
              </div>
            </form>
          </div>
          <div className="btn-wrapper">
            <button onClick={editCategoryNameHandler}>카테고리 수정완료</button>
          </div>
        </div>
      )}
      {!editCategoryName && !editCategoryOrder && cookies.token && (
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
        !editCategoryName &&
        cookies.token && (
          <div className="btn-wrapper">
            <button onClick={editCategoryOrderHandler}>
              카테고리 순서 변경하기
            </button>
          </div>
        )
      )}
      <div className="btn-wrapper">
        {cookies.token && !editCategoryOrder && !editCategoryName && (
          <Link className="" to="/admin/new-product">
            <button>새 제품 추가</button>
          </Link>
        )}
      </div>
      <div className="btn-wrapper">
        {cookies.token && <button onClick={logoutHandler}>로그아웃</button>}
      </div>
    </SidebarWrapper>
  );
};

export default Sidebar;
