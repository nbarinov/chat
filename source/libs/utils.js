export const findUser = (array, id) => array.filter((item) => item.id === id).length;

export const findUserByName = (array, username) => array.filter((item) => item.username === username)[0];

export const addUser = (array, item) => [...array, item];

export const removeUser = (array, id) => array.filter((item) => item.id !== id);

export const filterByName = (array, username) => array.filter((item) => item.username !== username);