import { AxCrew } from "@amitdeshmukh/ax-crew";
import type { FunctionRegistryType } from "@amitdeshmukh/ax-crew";
import { WordPressPost } from "@ax-crew/tools-wordpress";

const crewConfig = {
  crew: [
    {
      name: "ContentWriter",
      description: "Write content for an engaging blog post and publish it to WordPress with the status 'publish'. The opening paragraph should be a hook to entice the reader to continue reading. The post should be 300-500 words long and formatted in HTML.",
      signature: "topic:string \"The topic of the post\" -> postURL:string \"The URL of the published post\"",
      provider: "google-gemini",
      providerKeyName: "GEMINI_API_KEY",
      ai: {
        model: "gemini-2.0-flash",
        temperature: 0.7,
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
  const agents = crew.addAgentsToCrew(["ContentWriter"]);
  const contentWriter = agents?.get("ContentWriter");

  crew.state.set("env", {
    WORDPRESS_URL: "http://my-wordpress-site.com",
    WORDPRESS_USERNAME: "my-username",
    WORDPRESS_PASSWORD: "my-password"
  });

  console.log('Environment state:', crew.state.get("env"));

  const topic = "The latest trends in Quantum Computing";
  const contentWriterResponse = await contentWriter?.forward({ topic });
  
  console.log(contentWriterResponse);
}

main().catch(console.error); 