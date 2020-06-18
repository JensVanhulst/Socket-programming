const fetch = require("node-fetch");

module.exports = async () => {
  const data = await fetch('https://meme-api.herokuapp.com/gimme');
  const meme = await data.json();
  return meme.url;
}