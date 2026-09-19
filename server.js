const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// ===============================
// ENV
// ===============================

const API_KEY = process.env.GNEWS_API_KEY;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123456";


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

            console.log("GNEWS ERROR:", data);

            return res.status(response.status).json({
                error: "GNews API error",
                details: data
            });
        }

        res.json(data);

    } catch (error) {

        console.log("News Error:", error);

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

            console.log("SEARCH ERROR:", data);

            return res.status(response.status).json({
                error: "Search API error",
                details: data
            });
        }

        res.json(data);

    } catch (error) {

        console.log("Search Error:", error);

        res.status(500).json({
            error: "Search news nahi mili"
        });
    }
});


// ===============================
// ADMIN LOGIN
// ===============================

app.post("/api/admin-login", (req, res) => {

    const { password } = req.body;

    if (password === ADMIN_PASSWORD) {

        return res.json({
            success: true
        });
    }

    res.status(401).json({
        success: false,
        error: "Wrong password"
    });
});


// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        "SERVER RUNNING ON PORT " + PORT
    );

});