import { Router, Request, Response } from "express";
import { WattpadStory } from "../model/wattpad-story.model";
import { AUTHORS, ROUND_TWO_START_DATE } from "../utils/const";
import { create } from "domain";

const storyRouter = Router();

// Create new route to get all stories from the festfic account (round 1)
storyRouter.get("/stories", async (req: Request, res: Response) => {
  try {
    const URL =
      process.env.URL ||
      "https://www.wattpad.com/v4/users/nwjnsfcvn/stories/published";
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const stories = data.total;
    // Fetch all stories
    const allStoriesResponse = await fetch(`${URL}?limit=${stories}`);

    if (!allStoriesResponse.ok) {
      throw new Error(`HTTP error! status: ${allStoriesResponse.status}`);
    }

    const allStoriesData = await allStoriesResponse.json();
    let index = 0;
    const newStories: WattpadStory[] = allStoriesData.stories.map(
      (story: any) => {
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
      }
    );
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get stories" });
  }
});

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

export default storyRouter;
