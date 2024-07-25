import { Router, Request, Response } from "express";
import { WattpadStory } from "../model/wattpad-story.model";
import { AUTHORS, ROUND_TWO_START_DATE } from "../utils/const";

const storyRoundTwo = Router();

// Create new route to get all stories from the festfic account (round 2)
// Create new route to get all stories from the festfic account (round 2)
// This round the author has upload the story by themself so we can get the stories by using the author name and sort by date to get the latest stories
storyRoundTwo.get("/stories-round-2", async (req: Request, res: Response) => {
  try {
    const stories: WattpadStory[] = [];
    await Promise.all(
      // Add a delay of 1 second before each request
      AUTHORS.map(async (author: string) => {
        const URL = `https://www.wattpad.com/v4/users/${author}/stories/published`;
        const response = await fetch(URL);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
          // Log the response to console
        }
        const data = await response.json();
        const total = data.total;
        // Fetch all stories
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
            };
          }
        );
        // Sort by modified date (keep this, it's good practice)
        authorStories.sort((a, b) => {
          return (
            new Date(b.modifyDate).getTime() - new Date(a.modifyDate).getTime()
          );
        });
        // Filter the stories by create date after the round 2 start date
        authorStories = authorStories.filter((story) => {
          return new Date(story.createDate) > ROUND_TWO_START_DATE;
        });
        // TODO: Add check the @nwjnsfcvn account check to be valid story for round 2
        // Push the latest story from each author
        if (authorStories[0] !== null && authorStories[0] !== undefined) {
          stories.push(authorStories[0]);
        }
      })
    );

    // Sort the stories array after all promises have resolved
    stories.sort((a, b) => {
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
    res.status(200).json(stories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get stories" });
  }
});

export default storyRoundTwo;
