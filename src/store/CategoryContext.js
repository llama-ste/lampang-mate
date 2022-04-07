import { createContext, useState } from "react";

const CategoryContext = createContext({
  category: "",
  prevCategory: "",
  selectCategory: (categoryId) => {},
  completeChange: () => {},
});

export const CategoryContextProvider = ({ children }) => {
  const [category, setCategory] = useState("");
  const [prevCategory, setPrevCategory] = useState(category);

  const selectCategory = (categoryId) => {
    setPrevCategory(category);
    setCategory(categoryId);
  };

  const completeChange = () => {
    setPrevCategory(category);
  };

  const contextValue = {
    category,
    prevCategory,
    selectCategory,
    completeChange,
  };

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContext;
