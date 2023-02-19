import axios from "axios";
import cheerio from "cheerio";

class HuggingInfo {
    constructor(options = {}) {
        this.url = "https://huggingface.co";
        this.api = axios.create({
            baseURL: this.url,
        });
    }

    async getTasks() {
        /**
         * Fetches the tasks available from the Huggingface model hub.
         * @returns {Promise}
         * @fulfill {Object} - An object containing the url and an array of tasks.
         * @reject {Error} - An error object containing the error message.
         */
        let url = "https://huggingface.co/models";
        let toReturn = {
            url: url,
            tasks: [],
        };

        const response = await this.api({
            url: url,
            method: "GET",
        }).catch((err) => {
            if (err.response.status == 404) {
                throw new Error("Page not found.");
            }
        });
        let html = response.data;
        const $ = cheerio.load(html);
        $("a.tag.tag-white").each(function (index, element) {
            toReturn.tasks.push({
                name: $(this).text().trim(),
                url: $(this).attr("href"),
            });
        });

        return toReturn;
    }

    async getModelList(task, sortBy = "downloads", page = 0) {
        /**
         * Fetches the model list from the Huggingface model hub for a certain task.
         * @param {string} task - The task to fetch models for.
         * @param {string} sortBy - The field to sort by. Defaults to "downloads".
         * @param {number} page - The page number to fetch. Defaults to 0.
         * @returns {Promise}
         * @fulfill {Object} - An object containing the url, total number of models, an array of models, and the next page number.
         * @reject {Error} - An error object containing the error message.
         */
        if (task == undefined || task == null || task == "") {
            throw new Error("Task cannot be empty.");
        }
        if (new Set(["downloads", "likes", "modified"]).has(sortBy) == false) {
            throw new Error(
                "sortBy must be one of 'downloads', 'likes', or 'modified'."
            );
        }

        let url =
            "https://huggingface.co/models?pipeline_tag=" +
            task +
            "&sort=" +
            sortBy +
            "&p=" +
            page;

        let toReturn = {
            url: url,
            totalModels: 0,
            models: [],
            nextPage: null,
        };

        const response = await this.api({
            url: url,
            method: "GET",
        }).catch((err) => {
            if (err.response.status == 404) {
                throw new Error("Page not found.");
            }
        });
        let html = response.data;
        const $ = cheerio.load(html);
        $("article.overview-card-wrapper").each(function (index, element) {
            let lastUpdated = $(this)
                .find("span.truncate")
                .text()
                .slice($(this).find("span.truncate").text().search(/\t/))
                .trim();

            let divText = $(this).find("div").text();
            let likes = $(this)
                .find("div")
                .text()
                .slice(divText.lastIndexOf("•"));
            likes = likes.slice(likes.search(/\t/)).trim();

            let downloads = divText.slice(
                divText.split("•", 2).join("•").length,
                divText.split("•", 3).join("•").length
            );
            downloads = downloads.slice(downloads.search(/\t/)).trim();

            toReturn.models.push({
                name: $(this).find("h4").text(),
                lastUpdated: lastUpdated,
                downloads: downloads,
                likes: likes.lastIndexOf(lastUpdated) == -1 ? likes : "",
            });
        });

        toReturn.totalModels = parseInt($("h1").next().text().replace(",", ""));

        let lastPage =
            parseInt($("li.hidden.sm\\:block").last().find("a").text()) - 1;
        if (page < lastPage) {
            toReturn.nextPage = page + 1;
        } else {
            toReturn.nextPage = null;
        }

        return toReturn;
    }

    async getModelInfo(name) {
        /**
         * Fetches model information from the Huggingface model hub.
         * @param {string} name - The name of the model.
         * @returns {Promise}
         * @fulfill {Object} - An object containing information about the model.
         * @reject {Error} - An error object containing the error message.
         */
        if (name == undefined || name == null || name == "") {
            throw new Error("Model name cannot be empty.");
        }

        let url = "https://huggingface.co/" + name;
        let toReturn = {
            url: url,
            name: name,
            shortDescription: "",
            //lastUpdated: "",
            downloads: "",
            likes: "",
            tags: [],
            license: "",
            fillType: "",
        };

        const response = await this.api({
            url: url,
            method: "GET",
        }).catch((err) => {
            if (err.response.status == 404) {
                throw new Error("Model not found.");
            }
        });
        let html = response.data;
        const $ = cheerio.load(html);
        toReturn.shortDescription = $("div.prose.hf-sanitized")
            .find("p")
            .first()
            .text()
            .trim()
            .replace(/\n/g, " ");
        toReturn.downloads = parseInt($("dd").text().trim().replace(/,/g, ""));
        toReturn.likes = parseInt(
            $(".SVELTE_HYDRATER.contents:nth-child(2)")
                .find("button:nth-child(2)")
                .text()
                .trim()
                .replace(/,/g, "")
        );
        $(".SVELTE_HYDRATER.contents:nth-child(2)")
            .find("span")
            .each(function (index, element) {
                if ($(this).text().trim() == "License:") {
                    toReturn.license = $(this).next().text().trim();
                    return false;
                }
                toReturn.tags.push($(this).text().trim());
            });
        if (toReturn.tags[0] == "Fill-Mask") {
            toReturn.fillType = $("code").last().text().trim();
        }

        return toReturn;
    }
}

export default HuggingInfo;
