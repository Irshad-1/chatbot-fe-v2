import API from '../Utils/axios';
function getAllDepartments() {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await API.get('/get-all-department');
      resolve(response?.data);
    } catch (error) {
      reject({ message: error });
    }
  });
}
function getAllDesignation() {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await API.get('/get-all-designation');
      resolve(response?.data);
    } catch (error) {
      reject({ message: error });
    }
  });
}
function getAllActions() {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await API.get('/get-all-action');
      resolve(response?.data);
    } catch (error) {
      reject({ message: error });
    }
  });
}

function getAllAnswers() {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await API.get('/get-all-answer');
      resolve(response?.data);
    } catch (error) {
      reject({ message: error });
    }
  });
}
function getAllSystemQuestions() {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await API.get('/get-all-system-question');
      resolve(response?.data);
    } catch (error) {
      reject({ message: error });
    }
  });
}

export { getAllDepartments, getAllDesignation, getAllActions, getAllAnswers, getAllSystemQuestions };
