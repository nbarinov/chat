export const findUser = (array, id) => array.filter((item) => item.id === id).length;

export const addUser = (array, item) => [...array, item];

export const removeUser = (array, id) => array.filter((item) => item.id !== id);