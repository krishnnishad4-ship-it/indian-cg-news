const express = require("express");

const app = express();

app.use(express.static("."));

const API_KEY = "79db985070a21574b9b2c316e8fad703";


// ===============================
// CATEGORY NEWS
// ===============================

app.get("/api/news", async (req, res) => {

    try {

        let category = req.query.category || "general";

        const allowedCategories = [
            "general",
            "world",
            "nation",
            "business",
            "entertainment",
            "sports"
        ];

        if (!allowedCategories.includes(category)) {
            category = "general";
        }

        const url =
            "https://gnews.io/api/v4/top-headlines" +
            "?category=" + category +
            "&lang=hi" +
            "&country=in" +
            "&max=10" +
            "&apikey=" + API_KEY;

        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok) {

            return res.status(response.status).json({
                error: "GNews API error",
                details: data
            });

        }

        res.json(data);

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            error: "News load nahi hui"
        });

    }

});


// ===============================
// SEARCH NEWS
// ===============================

app.get("/api/search", async (req, res) => {

    try {

        const query = req.query.q;

        if (!query) {

            return res.json({
                articles: []
            });

        }

        const params = new URLSearchParams({

            q: query,

            lang: "hi",

            country: "in",

            max: "10",

            sortby: "publishedAt",

            apikey: API_KEY

        });


        const response = await fetch(
            "https://gnews.io/api/v4/search?" + params
        );


        const data = await response.json();


        if (!response.ok) {

            return res.status(response.status).json({
                error: "Search API error",
                details: data
            });

        }


        res.json(data);

    }

    catch (error) {

        console.log("Search Error:", error);

        res.status(500).json({
            error: "Search news nahi mili"
        });

    }

});


// ===============================
// SERVER
// ===============================

app.listen(3001, () => {
    console.log("NEW SERVER RUNNING");
});