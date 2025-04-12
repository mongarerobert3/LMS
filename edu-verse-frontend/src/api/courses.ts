import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getCourses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error);
    throw error;
  }
};

export const getCoursesByInstructor = async (instructorId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/instructor/${instructorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching courses for instructor ${instructorId}:`, error);
    throw error;
  }
};

export const createCourse = async (courseData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/courses`, courseData);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourse = async (id: string, courseData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/courses/${id}`, courseData);
    return response.data;
  } catch (error) {
    console.error(`Error updating course ${id}:`, error);
    throw error;
  }
};

export const deleteCourse = async (id: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/courses/${id}`);
  } catch (error) {
    console.error(`Error deleting course ${id}:`, error);
    throw error;
  }
};

export const addModule = async (courseId: string, moduleData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/courses/${courseId}/modules`, moduleData);
    return response.data;
  } catch (error) {
    console.error(`Error adding module to course ${courseId}:`, error);
    throw error;
  }
};

export const updateModule = async (courseId: string, moduleId: string, moduleData: any) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/courses/${courseId}/modules/${moduleId}`,
      moduleData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating module ${moduleId} in course ${courseId}:`, error);
    throw error;
  }
};

export const deleteModule = async (courseId: string, moduleId: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/courses/${courseId}/modules/${moduleId}`);
  } catch (error) {
    console.error(`Error deleting module ${moduleId} from course ${courseId}:`, error);
    throw error;
  }
};
