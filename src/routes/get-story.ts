import { Router, Request, Response } from "express";
import { WattpadStory } from "../model/wattpad-story.model";

const storyRouter = Router();

// Create new route to get all stories from the festfic account
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
          reads: story.readCount,
          votes: story.voteCount,
          comments: story.commentCount,
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

export default storyRouter;
