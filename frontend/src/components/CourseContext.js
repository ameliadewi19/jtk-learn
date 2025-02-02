import { createContext, useContext, useState } from 'react';

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [combinedData, setCombinedData] = useState([]);

  return (
    <CourseContext.Provider value={{ combinedData, setCombinedData }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => useContext(CourseContext);
