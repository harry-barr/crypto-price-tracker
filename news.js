import FetchWrapper from "./fetch-wrapper.js";
const API = new FetchWrapper("https://newsapi.org/v2/top-headlines?q=");
const newsContainer = document.querySelector(".news-tile-container");

const getNews = async function () {
  try {
    const data = await API.get(
      `crypto&apiKey=de15e0d6542040ffaaaebe4f8d383524`
    );
    console.log(data);
    newsContainer.innerHTML = "";
    newsContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="main-news">
      <div class="main-news-left">
        <a href="${data.articles[0].url}" target="_blank">
        <img src="${data.articles[0].urlToImage}" class="news-tile-img"> 
        </a>   
        <a href="${data.articles[0].url}" target="_blank"><h2 class="news-tile-headline">${data.articles[0].title}</h2></a>
        <hr class="news-tile-divider" />
        <p class="news-tile-desc">
          ${data.articles[0].description}
        </p>
      </div>
      <div class="main-news-right">
        <a href="${data.articles[1].url}" target="_blank">
        <img src="${data.articles[1].urlToImage}" class="news-tile-img"> 
        </a>
        <a href="${data.articles[1].url}" target="_blank"><h2 class="news-tile-headline">${data.articles[1].title}</h2></a>
        <hr class="news-tile-divider" />
        <p class="news-tile-desc">
        ${data.articles[1].description}
        </p>
      </div>
      <div class="main-news-left">
        <a href="${data.articles[2].url}" target="_blank">
        <img src="${data.articles[2].urlToImage}" class="news-tile-img"> 
        </a>   
        <a href="${data.articles[2].url}" target="_blank"><h2 class="news-tile-headline">${data.articles[2].title}</h2></a>
        <hr class="news-tile-divider" />
        <p class="news-tile-desc">
          ${data.articles[2].description}
        </p>
      </div>
      <div class="main-news-right">
        <a href="${data.articles[3].url}" target="_blank">
        <img src="${data.articles[3].urlToImage}" class="news-tile-img"> 
        </a>
        <a href="${data.articles[3].url}" target="_blank"><h2 class="news-tile-headline">${data.articles[3].title}</h2></a>
        <hr class="news-tile-divider" />
        <p class="news-tile-desc">
        ${data.articles[3].description}
        </p>
      </div>
      </div>
      `
    );
  } catch (error) {
    console.error(error);
  }
};

window.addEventListener("load", getNews);
