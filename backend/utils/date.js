const getISTDate = () =>
  new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Kolkata",
  });

module.exports = { getISTDate };
