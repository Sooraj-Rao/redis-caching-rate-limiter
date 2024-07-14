export const getProduct = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          roll: 20,
          age: 1 * 4,
        },
        {
          id: 2,
          roll: 30,
          age: 2 * 4,
        },
      ]);
    }, 1000);
  });
};

export const getProductOne = (id: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: id,
        roll: `${id}2`,
        age: `${id}5`,
      });
    }, 2000);
  });
};
