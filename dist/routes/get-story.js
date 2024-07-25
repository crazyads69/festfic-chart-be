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
// Create new route to get all stories from the festfic account (round 1)
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
                author: story.user.name,
                reads: story.readCount,
                votes: story.voteCount,
                comments: story.commentCount,
                modifyDate: story.modifyDate,
                createDate: story.createDate,
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
// Create new route to get all stories from the festfic account (round 2)
// This round the author has upload the story by themself so we can get the stories by using the author name and sort by date to get the latest stories
// storyRouter.get("/stories-round-2", async (req: Request, res: Response) => {
//   try {
//     const stories: WattpadStory[] = [];
//     await Promise.all(
//       AUTHORS.map(async (author) => {
//         const URL = `https://www.wattpad.com/v4/users/${author}/stories/published`;
//         const response = await fetch(URL);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         const authorStories: WattpadStory[] = data.stories.map((story: any) => {
//           return {
//             id: story.id,
//             title: story.title,
//             description: story.description,
//             cover: story.cover,
//             url: story.url,
//             author: story.user.name,
//             reads: story.readCount,
//             votes: story.voteCount,
//             comments: story.commentCount,
//             createDate: story.createDate,
//             modifyDate: story.modifyDate,
//           };
//         });
//         // Sort by modified date (keep this, it's good practice)
//         authorStories.sort((a, b) => {
//           return (
//             new Date(b.modifyDate).getTime() - new Date(a.modifyDate).getTime()
//           );
//         });
//         // Filter the stories by the create date after the round 2 start date
//         authorStories.filter((story) => {
//           return new Date(story.createDate) >= ROUND_TWO_START_DATE;
//         });
//         // TODO: Add check the @nwjnsfcvn account check to be valid story for round 2
//         // Push the latest story from each author
//         stories.push(authorStories[0]);
//       })
//     );
//     // Sort the stories array after all promises have resolved
//     stories.sort((a, b) => {
//       if (a.votes === b.votes) {
//         if (a.comments === b.comments) {
//           if (a.reads === b.reads) {
//             return b.id - a.id;
//           }
//           return b.reads - a.reads;
//         }
//         return b.comments - a.comments;
//       }
//       return b.votes - a.votes;
//     });
//     // Return the stories
//     res.status(200).json(stories);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to get stories" });
//   }
// });
exports.default = storyRouter;
//# sourceMappingURL=get-story.js.map