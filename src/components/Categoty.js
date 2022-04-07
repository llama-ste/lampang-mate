import { useContext, useState } from "react";
import CategoryContext from "../store/CategoryContext";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Category = ({ category, editCategoryName, reload, cookies }) => {
  const categoryCtx = useContext(CategoryContext);
  const [categoryName, setCategoryName] = useState(category.name);
  const [editCategoryMode, setEditCategoryMode] = useState(false);

  const editCategoryModeHandler = () => {
    setEditCategoryMode((prev) => !prev);
  };

  const completeEditHandler = async (id) => {
    await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${cookies.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: categoryName }),
    });

    reload();
    setEditCategoryMode(false);
  };

  const deleteCategoryHandler = async (id) => {
    await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    });

    reload();
  };

  return (
    <div
      key={category.id}
      className="category"
      onClick={
        editCategoryMode
          ? null
          : categoryCtx.selectCategory.bind(null, category.id)
      }
    >
      <div key={category.id}>
        {editCategoryMode ? (
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            type="text"
          />
        ) : (
          <b>{category.name}</b>
        )}
      </div>
      {editCategoryName && !editCategoryMode ? (
        <div className="category-name-edit-wrapper">
          <button onClick={editCategoryModeHandler}>✏️</button>
          <button onClick={deleteCategoryHandler.bind(null, category.id)}>
            🗑
          </button>
        </div>
      ) : null}
      {editCategoryMode && (
        <div className="category-name-edit-wrapper">
          <button onClick={editCategoryModeHandler}>취소</button>
          <button onClick={completeEditHandler.bind(null, category.id)}>
            저장
          </button>
        </div>
      )}
    </div>
  );
};

export default Category;
