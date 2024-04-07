let requestNumber = 1;
let requestErrorNumber = 1;

export const mockNetworkRequest = async () => {
  console.log(`Mock successful network request #${requestNumber}.`);
  let num = requestNumber;
  requestNumber++;
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    message: `Hello there! #${num}`,
  };
};

export const mockFailedNetworkRequest = async () => {
  console.log(`Mock failed network request #${requestErrorNumber}.`);
  requestErrorNumber++;
  await new Promise((resolve, reject) => setTimeout(reject, 500));

  return {
    message: 'Hello there!',
  };
};

export const mockPageNetworkRequest = async (page: number) => {
  console.log(`Mock successful network request for page #${page}.`);
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    message: `Hello there page #${page}!`,
  };
};
