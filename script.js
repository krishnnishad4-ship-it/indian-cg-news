// ===============================
// LOAD CATEGORY NEWS
// ===============================

async function loadNews() {

    try {

        const page = window.location.pathname;

        let category = "general";

        if (page.includes("india")) {
            category = "nation";
        }
        else if (page.includes("world")) {
            category = "world";
        }
        else if (page.includes("sports")) {
            category = "sports";
        }
        else if (page.includes("business")) {
            category = "business";
        }
        else if (page.includes("entertainment")) {
            category = "entertainment";
        }


        const response =
            await fetch("/api/news?category=" + category);

        const data = await response.json();

        if (data.articles) {
            showHomeNews(data.articles);
        }

    }
    catch (error) {

        console.log("News Error:", error);

    }

}


// ===============================
// HOME NEWS
// ===============================

function showHomeNews(articles) {

    const grid =
        document.querySelector(".news-grid");

    if (!grid) return;

    grid.innerHTML = "";


    articles.forEach(function(article) {

        const card =
            document.createElement("a");

        card.className = "card";

        card.href = article.url;

        card.target = "_blank";


        card.innerHTML = `

            <img src="${article.image || ""}">

            <div class="card-content">

                <span class="category">
                    📰 NEWS
                </span>

                <h2>
                    ${article.title || ""}
                </h2>

                <p>
                    ${article.description || "Latest news"}
                </p>

            </div>

        `;


        grid.appendChild(card);

    });

}


// ===============================
// SEARCH NEWS
// ===============================

async function searchNews() {

    const input =
        document.getElementById("searchInput");

    const result =
        document.getElementById("searchResult");

    const section =
        document.getElementById("searchSection");

    const grid =
        document.getElementById("searchGrid");


    const query =
        input.value.trim();


    if (!query) {

        section.style.display = "none";

        result.textContent = "";

        return;

    }


    result.textContent =
        "🔎 खबर खोजी जा रही है...";


    try {

        const response =
            await fetch(
                "/api/search?q=" +
                encodeURIComponent(query)
            );


        const data =
            await response.json();


        if (
            !data.articles ||
            data.articles.length === 0
        ) {

            section.style.display = "block";

            grid.innerHTML =
                "<p>❌ कोई खबर नहीं मिली</p>";

            result.textContent =
                "❌ कोई खबर नहीं मिली";

            return;

        }


        // Search Results show
        section.style.display = "block";


        // Purane results hatao
        grid.innerHTML = "";


        data.articles.forEach(function(article) {

            const card =
                document.createElement("a");

            card.className = "card";

            card.href = article.url;

            card.target = "_blank";


            card.innerHTML = `

                <img src="${article.image || ""}">

                <div class="card-content">

                    <span class="category">
                        📰 SEARCH NEWS
                    </span>

                    <h2>
                        ${article.title || ""}
                    </h2>

                    <p>
                        ${article.description || "Latest news"}
                    </p>

                </div>

            `;


            grid.appendChild(card);

        });


        result.textContent =
            "✅ " +
            data.articles.length +
            " खबर मिली";

    }
    catch (error) {

        console.log("Search Error:", error);

        result.textContent =
            "❌ Search error";

    }

}


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadNews();


        const input =
            document.getElementById("searchInput");


        if (input) {

            input.addEventListener(
                "keydown",
                function(event) {

                    if (event.key === "Enter") {

                        searchNews();

                    }

                }
            );

        }

    }
);