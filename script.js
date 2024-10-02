import FetchWrapper from "./fetch-wrapper.js";
const API = new FetchWrapper("https://api.coingecko.com/api/v3/");
const APIkey = "CG-zbZjxov9NgfktzCwyLDqU4sd";
const bitcoinPrice = document.querySelector(".price-value");
const coinTable = document.querySelector(".coin-table");
const title = document.querySelector(".title");
const bitcoinIcon = document.querySelector(".fa-bitcoin");
const maxScroll = 130;
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector("search-btn");
const trendingContainer = document.querySelector(".trending-container");
const marketCap = document.querySelector(".market-cap");

/*

  TITLE SCROLL FUNCTIONALITY

*/

window.addEventListener("scroll", () => {
  // Get scroll position (0 at top, increasing as you scroll down)
  const scrollPosition = window.scrollY;

  if (scrollPosition <= maxScroll) {
    const newSize = 40 - scrollPosition / 10; // Adjust formula as needed
    const newMarginRight = 20 + scrollPosition / 1.25;
    title.style.fontSize = `${newSize}px`;
    title.style.marginRight = `${newMarginRight}px`;
    bitcoinIcon.style.fontSize = `${newSize}px`;
    bitcoinIcon.style.animation = "2s rotate ease-in-out infinite";
  } else {
    title.style.fontSize = `27px`;
    bitcoinIcon.style.animation = "2s rotate ease-in-out 1";
  }
});

/* 

  LONG TABLE OF MARKET PRICES FUNCTIONALITY

*/

const marketPrices = async function () {
  try {
    const data = await API.get(
      `coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&x_cg_demo_api_key=${APIkey}`
    );
    data.forEach((coin) => {
      coinTable.insertAdjacentHTML(
        "beforeend",
        `
        <tr class="rendered-table">
          <td class="position-value">${coin.market_cap_rank}</td>
          <td class="coin-value">${coin.name} <img class="crypto-img" src="${coin.image}"/></td>
          <td class="price-value">$${coin.current_price}</td>
          <td class="volume-value">$${coin.total_volume}</td>
          <td class="market-cap-value">$${coin.market_cap}</td>
          <td class="graph-value">GRAPH GOES HERE</td>
        </tr>
        `
      );
    });
  } catch (error) {
    console.error(error);
  }
};

/* 

  TRENDING AND GAINERS FUNCTIONALITY

*/

const getTrending = async function () {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-zbZjxov9NgfktzCwyLDqU4sd",
      },
    };
    const data = await API.get(`search/trending`, options);
    const coinData = data;
    console.log(coinData.coins[0].item.data.price_change_percentage_24h.usd);
    trendingContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="trending-coins">
                <h4><img src="${
                  coinData.coins[0].item.small
                }" class="trending-img"> ${coinData.coins[0].item.name}</h4>
                <h4><img src="${
                  coinData.coins[1].item.small
                }" class="trending-img"> ${coinData.coins[1].item.name}</h4>
                <h4><img src="${
                  coinData.coins[2].item.small
                }" class="trending-img"> ${coinData.coins[2].item.name}</h4>
              </div>
              <div class="trending-amount">
                <h4>
                  $${coinData.coins[0].item.data.price.toFixed(7)}
                  <span class="green"
                    ><i class="fa-solid fa-caret-up"></i> ${coinData.coins[0].item.data.price_change_percentage_24h.usd.toFixed(
                      2
                    )}%</span
                  >
                </h4>
                <h4>
                  $${coinData.coins[1].item.data.price.toFixed(2)}
                  <span class="red"
                    ><i class="fa-solid fa-caret-down"></i> ${coinData.coins[1].item.data.price_change_percentage_24h.usd.toFixed(
                      2
                    )}%</span
                  >
                </h4>
                <h4>
                  $${coinData.coins[2].item.data.price.toFixed(2)}
                  <span class="red"
                    ><i class="fa-solid fa-caret-down"></i> ${coinData.coins[2].item.data.price_change_percentage_24h.usd.toFixed(
                      2
                    )}%</span
                  >
                </h4>
              </div>`
    );
  } catch (error) {
    console.error(error);
  }
};

const getActiveCryptocurrencies = async function () {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-zbZjxov9NgfktzCwyLDqU4sd",
      },
    };
    const data = await API.get("global", options);
    console.log(data.data);
    marketCap.insertAdjacentHTML(
      "beforeend",
      `<h3>${data.data.active_cryptocurrencies}</h3>
      <h4>Total Number of Active Cryptocurrencies</h4>`
    );
  } catch (error) {
    console.error(error);
  }
};

/* 

  WINDOW EVENT LISTENERS

*/
window.addEventListener("load", getActiveCryptocurrencies);
window.addEventListener("load", getTrending);
window.addEventListener("load", marketPrices);
