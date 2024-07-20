"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storyRouter = (0, express_1.Router)();
// Create new route to get all stories from the festfic account
storyRouter.get("/stories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const URL = process.env.URL ||
            "https://www.wattpad.com/v4/users/nwjnsfcvn/stories/published";
        const response = yield fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = yield response.json();
        const stories = data.total;
        // Fetch all stories
        const allStoriesResponse = yield fetch(`${URL}?limit=${stories}`);
        if (!allStoriesResponse.ok) {
            throw new Error(`HTTP error! status: ${allStoriesResponse.status}`);
        }
        const allStoriesData = yield allStoriesResponse.json();
        let index = 0;
        const newStories = allStoriesData.stories.map((story) => {
            return {
                id: index++,
                title: story.title,
                description: story.description,
                cover: story.cover,
                url: story.url,
                reads: story.readCount,
                votes: story.voteCount,
                comments: story.commentCount,
            };
        });
        // Sort the stories by using the stable sort algorithm
        // Stable Sort Implementation
        newStories.sort((a, b) => {
            if (a.votes === b.votes) {
                if (a.comments === b.comments) {
                    if (a.reads === b.reads) {
                        return b.id - a.id;
                    }
                    return b.reads - a.reads;
                }
                return b.comments - a.comments;
            }
            return b.votes - a.votes;
        });
        // Return the stories
        res.status(200).json(newStories);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get stories" });
    }
}));
exports.default = storyRouter;
//# sourceMappingURL=get-story.js.map