module.exports = getISTDate = () => {
  return new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Kolkata",
  });
};
