import { Router, Request, Response } from "express";
import { WattpadStory } from "../model/wattpad-story.model";
import {
  AUTHORS,
  ROUND_TWO_END_DATE,
  ROUND_TWO_START_DATE,
} from "../utils/const";
import cheerio from "cheerio";

const storyRoundTwo = Router();

// Create new route to get all stories from the festfic account (round 2)
// Create new route to get all stories from the festfic account (round 2)
// This round the author has upload the story by themself so we can get the stories by using the author name and sort by date to get the latest stories
// storyRoundTwo.get("/stories-round-2", async (req: Request, res: Response) => {
//   try {
//     const stories: (WattpadStory | null)[] = [];

//     await Promise.all(
//       AUTHORS.map(async (author: string) => {
//         const URL = `https://www.wattpad.com/v4/users/${author}/stories/published`;
//         const response = await fetch(URL);

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         const total = data.total;
//         // Fetch all stories
//         const allStoriesResponse = await fetch(`${URL}?limit=${total}`);

//         if (!allStoriesResponse.ok) {
//           throw new Error(`HTTP error! status: ${allStoriesResponse.status}`);
//         }

//         const allStoriesData = await allStoriesResponse.json();
//         let authorStories: WattpadStory[] = allStoriesData.stories.map(
//           (story: any) => {
//             return {
//               id: story.id,
//               title: story.title,
//               description: story.description,
//               cover: story.cover,
//               url: story.url,
//               author: story.user.name,
//               reads: story.readCount,
//               votes: story.voteCount,
//               comments: story.commentCount,
//               modifyDate: story.modifyDate,
//               createDate: story.createDate,
//               parts: story.parts,
//             };
//           }
//         );

//         // Sort by modified date
//         authorStories.sort((a, b) => {
//           return (
//             new Date(b.modifyDate).getTime() - new Date(a.modifyDate).getTime()
//           );
//         });

//         // Filter the stories by create date after the round 2 start date and before the round 2 end date
//         authorStories = authorStories.filter((story) => {
//           return (
//             new Date(story.createDate) > ROUND_TWO_START_DATE &&
//             new Date(story.createDate) < ROUND_TWO_END_DATE
//           );
//         });

//         let validStoryFound = false;

//         for (let i = 0; i < authorStories.length; i++) {
//           const story = authorStories[i];

//           for (let j = 0; j < story.parts.length; j++) {
//             const part = story.parts[j];
//             const partResponse = await fetch(part.url);
//             if (!partResponse.ok) {
//               throw new Error(`HTTP error! status: ${partResponse.status}`);
//             }
//             console.log(
//               "Author: ",
//               author,
//               "Story: ",
//               story.title,
//               "Part: ",
//               j
//             );
//             const partData = await partResponse.text();
//             const validStory = partData.includes("nwjnsfcvn");

//             if (validStory) {
//               stories.push({
//                 id: story.id,
//                 title: story.title,
//                 description: story.description,
//                 cover: story.cover,
//                 url: story.url,
//                 author: story.author,
//                 reads: story.parts[0].readCount,
//                 votes: story.parts[0].voteCount,
//                 comments: story.parts[0].commentCount,
//                 modifyDate: story.modifyDate,
//                 createDate: story.createDate,
//                 parts: story.parts,
//               });
//               validStoryFound = true;
//               break;
//             }
//           }

//           if (validStoryFound) {
//             break;
//           }
//         }

//         if (!validStoryFound) {
//           stories.push(null);
//         }
//       })
//     );

//     // Sort the stories array after all promises have resolved
//     stories.sort((a, b) => {
//       if (a && b) {
//         if (a.votes === b.votes) {
//           if (a.comments === b.comments) {
//             if (a.reads === b.reads) {
//               return b.id - a.id;
//             }
//             return b.reads - a.reads;
//           }
//           return b.comments - a.comments;
//         }
//         return b.votes - a.votes;
//       }
//       return a ? -1 : 1; // Place nulls at the end of the array
//     });

//     // Return the stories
//     res.status(200).json(stories);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to get stories" });
//   }
// });
storyRoundTwo.get("/stories-round-2", async (req: Request, res: Response) => {
  try {
    const stories: (WattpadStory | null)[] = [];

    await Promise.all(
      AUTHORS.map(async (author: string) => {
        const URL = `https://www.wattpad.com/v4/users/${author}/stories/published`;
        const response = await fetch(URL);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const total = data.total;
        // Fetch all stories by the author
        const allStoriesResponse = await fetch(`${URL}?limit=${total}`);

        if (!allStoriesResponse.ok) {
          throw new Error(`HTTP error! status: ${allStoriesResponse.status}`);
        }

        const allStoriesData = await allStoriesResponse.json();
        let authorStories: WattpadStory[] = allStoriesData.stories.map(
          (story: any) => {
            return {
              id: story.id,
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
              parts: story.parts,
            };
          }
        );

        // Sort by modified date
        authorStories.sort((a, b) => {
          return (
            new Date(b.modifyDate).getTime() - new Date(a.modifyDate).getTime()
          );
        });

        // Filter the stories by create date after the round 2 start date and before the round 2 end date
        authorStories = authorStories.filter((story) => {
          return (
            new Date(story.createDate) > ROUND_TWO_START_DATE &&
            new Date(story.createDate) < ROUND_TWO_END_DATE
          );
        });

        let validStoryFound = false;

        for (const story of authorStories) {
          for (const part of story.parts) {
            let page = 1;
            let foundTag = false;

            while (!foundTag) {
              const partResponse = await fetch(
                `https://www.wattpad.com/apiv2/?m=storytext&id=${part.id}&page=${page}`
              );
              if (!partResponse.ok) {
                throw new Error(`HTTP error! status: ${partResponse.status}`);
              }
              const partData = await partResponse.text();

              if (partData.includes("nwjnsfcvn")) {
                stories.push({
                  id: story.id,
                  title: story.title,
                  description: story.description,
                  cover: story.cover,
                  url: story.url,
                  author: story.author,
                  reads: story.parts[0].readCount,
                  votes: story.parts[0].voteCount,
                  comments: story.parts[0].commentCount,
                  modifyDate: story.modifyDate,
                  createDate: story.createDate,
                  parts: story.parts,
                });
                foundTag = true;
                validStoryFound = true;
                break;
              }

              // Check if the response data length is zero
              if (partData.length === 0) {
                break;
              }

              page++;
            }

            if (validStoryFound) {
              break;
            }
          }

          if (validStoryFound) {
            break;
          }
        }

        if (!validStoryFound) {
          stories.push(null);
        }
      })
    );

    // Sort the stories array after all promises have resolved
    stories.sort((a, b) => {
      if (a && b) {
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
      }
      return a ? -1 : 1; // Place nulls at the end of the array
    });

    // Return the stories
    res.status(200).json(stories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get stories" });
  }
});

export default storyRoundTwo;
