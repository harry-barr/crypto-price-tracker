import FetchWrapper from "./fetch-wrapper.js";
export const API = new FetchWrapper("https://api.coingecko.com/api/v3/");
export const APIkey = "CG-zbZjxov9NgfktzCwyLDqU4sd";
const coinTable = document.querySelector(".coin-table");
const title = document.querySelector(".title");
const bitcoinIcon = document.querySelector(".fa-bitcoin");
const maxScroll = 130;
const searchInput = document.querySelector(".search-input");
const searchForm = document.querySelector("#search-form");
const trendingContainer = document.querySelector(".trending-container");
const marketCap = document.querySelector(".market-cap");
const tradingVolume = document.querySelector(".trading-volume");
const titleDiv = document.querySelector(".title-and-search-div");
const searchCryptoContainer = document.querySelector(
  ".search-crypto-container"
);
const newsBtn = document.querySelector("#news");
const newsSection = document.querySelector(".news-section");

export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": "CG-zbZjxov9NgfktzCwyLDqU4sd",
  },
};
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

const scrollDown = function () {
  newsSection.scrollIntoView({
    behavior: "smooth",
  });
};

/* 

  LONG TABLE OF MARKET PRICES FUNCTIONALITY

*/

const marketPrices = async function () {
  try {
    const data = await API.get(
      `coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&x_cg_demo_api_key=${APIkey}`
    );
    for (let index = 0; index < data.length; index++) {
      const coin = data[index];
      coinTable.insertAdjacentHTML(
        "beforeend",
        `
        <tbody>
          <tr class="rendered-table">
            <td class="position-value">${coin.market_cap_rank}</td>
            <td class="coin-value"><img class="crypto-img" src="${
              coin.image
            }"/> ${coin.name}</td>
            <td class="price-value">$${coin.current_price.toLocaleString(
              "en-US"
            )}</td>
            <td class="volume-value">$${coin.total_volume.toLocaleString(
              "en-US"
            )}</td>
            <td class="market-cap-value">$${coin.market_cap.toLocaleString(
              "en-US"
            )}</td>
            <td class="graph-value"><canvas class="coin-line-chart" id="chart-${index}"></canvas></td>
          </tr>
        </tbody>
        `
      );

      await new Promise((resolve) => setTimeout(resolve, 100)); // 500 ms delay
      await getChartData(coin.id, index); // Call the function to load the chart data
    }
    setupSortFunctionality();
  } catch (error) {
    console.error(error);
  }
};

function setupSortFunctionality() {
  const sortBtns = document.querySelectorAll(".sort");
  sortBtns.forEach((btn, index) => {
    let asc = true;

    // Create a span for the icon to toggle separately
    const icon = document.createElement("span");
    icon.classList.add("fa-solid", "fa-caret-down");
    btn.appendChild(icon);

    btn.addEventListener("click", () => {
      sortTableByColumn(coinTable, index, asc);
      asc = !asc; // Toggle sort order

      // Toggle the icon class based on the sort order
      if (asc) {
        icon.classList.replace("fa-caret-down", "fa-caret-up");
      } else {
        icon.classList.replace("fa-caret-up", "fa-caret-down");
      }
    });
  });
}

// Sorting function
function sortTableByColumn(table, column, asc = true) {
  const dirModifier = asc ? 1 : -1;
  const rows = Array.from(table.querySelectorAll("tbody tr"));

  const sortedRows = rows.sort((a, b) => {
    const aColText = a
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();
    const bColText = b
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();

    const aValue = !isNaN(aColText.replace(/[^0-9.-]+/g, ""))
      ? parseFloat(aColText.replace(/[^0-9.-]+/g, ""))
      : aColText;
    const bValue = !isNaN(bColText.replace(/[^0-9.-]+/g, ""))
      ? parseFloat(bColText.replace(/[^0-9.-]+/g, ""))
      : bColText;

    return aValue > bValue ? dirModifier : -dirModifier;
  });

  // Clear and re-append sorted rows
  table.querySelector("tbody").innerHTML = "";
  sortedRows.forEach((row) => table.querySelector("tbody").appendChild(row));
}

/* 

  TRENDING FUNCTIONALITY

*/

const getTrending = async function () {
  try {
    const data = await API.get(`search/trending`, options);
    const coinData = data;
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
                  <span class="${
                    coinData.coins[0].item.data.price_change_percentage_24h
                      .usd < 0
                      ? "red"
                      : "green"
                  }"
                    ><i class="fa-solid ${
                      coinData.coins[0].item.data.price_change_percentage_24h
                        .usd < 0
                        ? "fa-caret-down red"
                        : "fa-caret-up green"
                    }"></i> 
                    ${coinData.coins[0].item.data.price_change_percentage_24h.usd.toFixed(
                      2
                    )}%</span
                  >
                </h4>
                <h4>
                  $${coinData.coins[1].item.data.price.toFixed(7)}
                  <span class="${
                    coinData.coins[1].item.data.price_change_percentage_24h
                      .usd < 0
                      ? "red"
                      : "green"
                  }"
                    ><i class="fa-solid ${
                      coinData.coins[1].item.data.price_change_percentage_24h
                        .usd < 0
                        ? "fa-caret-down red"
                        : "fa-caret-up green"
                    }"></"></i> ${coinData.coins[1].item.data.price_change_percentage_24h.usd.toFixed(
        2
      )}%</span
                  >
                </h4>
                <h4>
                  $${coinData.coins[2].item.data.price.toFixed(7)}
                  <span class="${
                    coinData.coins[2].item.data.price_change_percentage_24h
                      .usd < 0
                      ? "red"
                      : "green"
                  }"
                    ><i class="fa-solid  ${
                      coinData.coins[2].item.data.price_change_percentage_24h
                        .usd < 0
                        ? "fa-caret-down red"
                        : "fa-caret-up green"
                    }""></i> ${coinData.coins[2].item.data.price_change_percentage_24h.usd.toFixed(
        2
      )}%</span
                  >
                </h4>
              </div>
              <div class="trending-coins">
                <h4><img src="${
                  coinData.coins[3].item.small
                }" class="trending-img"> ${coinData.coins[3].item.name}</h4>
                <h4><img src="${
                  coinData.coins[4].item.small
                }" class="trending-img"> ${coinData.coins[4].item.name}</h4>
                <h4><img src="${
                  coinData.coins[5].item.small
                }" class="trending-img"> ${coinData.coins[5].item.name}</h4>
              </div>
              <div class="trending-amount">
                <h4>
                  $${coinData.coins[3].item.data.price.toFixed(7)}
                  <span class="${
                    coinData.coins[3].item.data.price_change_percentage_24h
                      .usd < 0
                      ? "red"
                      : "green"
                  }"
                    ><i class="fa-solid ${
                      coinData.coins[3].item.data.price_change_percentage_24h
                        .usd < 0
                        ? "fa-caret-down red"
                        : "fa-caret-up green"
                    }"></i> 
                    ${coinData.coins[3].item.data.price_change_percentage_24h.usd.toFixed(
                      2
                    )}%</span
                  >
                </h4>
                <h4>
                  $${coinData.coins[4].item.data.price.toFixed(7)}
                  <span class="${
                    coinData.coins[4].item.data.price_change_percentage_24h
                      .usd < 0
                      ? "red"
                      : "green"
                  }"
                    ><i class="fa-solid ${
                      coinData.coins[4].item.data.price_change_percentage_24h
                        .usd < 0
                        ? "fa-caret-down red"
                        : "fa-caret-up green"
                    }"></"></i> ${coinData.coins[4].item.data.price_change_percentage_24h.usd.toFixed(
        2
      )}%</span
                  >
                </h4>
                <h4>
                  $${coinData.coins[5].item.data.price.toFixed(7)}
                  <span class="${
                    coinData.coins[5].item.data.price_change_percentage_24h
                      .usd < 0
                      ? "red"
                      : "green"
                  }"
                    ><i class="fa-solid  ${
                      coinData.coins[5].item.data.price_change_percentage_24h
                        .usd < 0
                        ? "fa-caret-down red"
                        : "fa-caret-up green"
                    }""></i> ${coinData.coins[5].item.data.price_change_percentage_24h.usd.toFixed(
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
    const data = await API.get("global", options);
    marketCap.insertAdjacentHTML(
      "beforeend",
      `<h3>${data.data.active_cryptocurrencies}</h3>
      <h4>Total Number of Active Cryptocurrencies</h4>`
    );
    tradingVolume.insertAdjacentHTML(
      "beforeend",
      `<h3>
              <span class="${
                data.data.market_cap_change_percentage_24h_usd < 0
                  ? "red"
                  : "green"
              } trading-volume"
                ><i class="fa-solid ${
                  data.data.market_cap_change_percentage_24h_usd < 0
                    ? "fa-caret-down"
                    : "fa-caret-up"
                }"></i> ${data.data.market_cap_change_percentage_24h_usd.toFixed(
        2
      )}%</span
              >
            </h3>
            <h4>Market Cap 24h Change</h4>`
    );
  } catch (error) {
    console.error(error);
  }
};

/* 


  SEARCH FOR CRYPTO FUNCTIONALITY


*/

const searchForCrypto = async function (e) {
  e.preventDefault();
  searchCryptoContainer.innerHTML = "";
  try {
    const search = searchInput.value.toLowerCase();
    const data = await API.get(`search?query=${search}`, options);
    const priceSearch = data.coins[0].id;
    const priceData = await API.get(
      `simple/price?ids=${priceSearch}&vs_currencies=usd`,
      options
    );
    searchInput.value = "";
    searchCryptoContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="search-crypto-img">
      <img src="${data.coins[0].large}" class="search-crypto-img"/></div>
      <div class="search-crypto-desc">
      <h1>${data.coins[0].name} [ ${data.coins[0].symbol} ]</h1>
      <h2>Market Cap Rank: ${data.coins[0].market_cap_rank}</h2>
      <h2>$${priceData[priceSearch]?.usd.toLocaleString() ?? ""}</h2>
      </div>`
    );
  } catch (error) {
    console.error(error);
  }
};

/* 

   EVENT LISTENERS

*/
window.addEventListener("load", getActiveCryptocurrencies);
window.addEventListener("load", getTrending);
window.addEventListener("load", marketPrices);
titleDiv.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Makes the scroll smooth
  });
});
searchForm.addEventListener("submit", searchForCrypto);
newsBtn.addEventListener("click", scrollDown);

/* 

  CHART FUNCTION 

*/

const getChartData = async function (coin, index) {
  try {
    const data = await API.get(
      `coins/${coin}/market_chart?vs_currency=usd&days=7`,
      options
    );
    console.log(data);

    const prices = data.prices.map((price) => price[1]); // Extract price values
    const minPrice = Math.min(...prices).toLocaleString("en-US");
    const endPrice = Number(prices[prices.length - 1]);
    const startPrice = Number(prices[0]);
    console.log(minPrice);
    const labels = data.prices.map((price) =>
      new Date(price[0]).toLocaleDateString()
    ); // Extract and format dates

    const canvas = document.getElementById(`chart-${index}`); // Select all canvas elements
    const ctx = canvas.getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: Array(labels.length).fill(""), // Set formatted dates as labels
        datasets: [
          {
            data: prices, // Set prices as data points
            fill: false,
            borderColor: `${startPrice - endPrice > 0 ? "red" : "green"}`,
            tension: 0.1,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true, // Make the chart responsive
        maintainAspectRatio: false,
        scales: {
          x: {
            display: false,
            title: {
              display: false,
            },
            grid: {
              display: false,
            },
          },
          y: {
            display: false,
            title: {
              display: false,
              // Y-axis title
            },
            beginAtZero: false,
            min: minPrice,
            ticks: {
              display: false,
            },
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
};
