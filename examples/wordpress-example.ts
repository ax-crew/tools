import { AxCrew } from "@amitdeshmukh/ax-crew";
import type { FunctionRegistryType } from "@amitdeshmukh/ax-crew";
import { WordPressPost } from "@ax-crew/tools-wordpress";

const crewConfig = {
  crew: [
    {
      name: "ContentWriter",
      description: "Writes content for a post",
      signature: "topic:string \"The topic of the post\" -> title:string \"The title of the post\" -> content:string \"The content of the post\"",
      provider: "google-gemini",
      providerKeyName: "GEMINI_API_KEY",
      ai: {
        model: "gemini-2.0-flash",
        temperature: 0.7,
      },
      options: {
        debug: true,
      }
    },
    {
      name: "Publisher",
      description: "Publishes content to WordPress",
      signature: "title:string \"The title of the post\" -> content:string \"The content of the post\" -> status:string \"The status of the post\"",
      provider: "google-gemini",
      providerKeyName: "GEMINI_API_KEY",
      ai: {
        model: "gemini-2.0-flash",
        temperature: 0,
      },
      options: {
        debug: true,
      },
      functions: ["PostToWordPress"]
    }
  ]
};

const myFunctions: FunctionRegistryType = {
  PostToWordPress: WordPressPost
};

async function main() {
  const crew = new AxCrew(crewConfig, myFunctions);
  const agents = crew.addAgentsToCrew(["ContentWriter", "Publisher"]);
  const contentWriter = agents?.get("ContentWriter");
  const publisher = agents?.get("Publisher");

  crew.state.set("env", {
    WORDPRESS_URL: "https://your-wordpress-site.com",
    WORDPRESS_USERNAME: "your-username",
    WORDPRESS_PASSWORD: "your-application-password"
  });

  console.log('Environment state:', crew.state.get("env"));

  const topic = "The latest trends in AI";
  const { title, content } = await contentWriter?.forward({ topic });
  const status = "publish";
  
  const result = await publisher?.forward({ title, content, status });
  console.log(result);
}

main().catch(console.error); 