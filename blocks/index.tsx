import { FileBlockProps, getLanguageFromFilename } from "@githubnext/blocks";
import { Box } from "@primer/react";
import { Endpoints } from "@octokit/types";
import { useEffect, useState } from "react";
import randomColor from "randomcolor";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  RoomProvider,
  useOthers,
  useUpdateMyPresence,
} from "./liveblocks.config";
import Cursor from "./components/Cursor";

type AppType = {
  content: string;
  name: string;
  colors: string[];
  hue: string;
  language: string;
};

function App({ content, name, colors, language }: AppType) {
  const others = useOthers();
  const updateMyPresence = useUpdateMyPresence();

  return (
    <Box p={4}>
      <Box
        borderColor="border.default"
        borderWidth={1}
        borderStyle="solid"
        borderRadius={6}
        overflow="hidden"
      >
        <Box
          bg="canvas.subtle"
          p={3}
          borderBottomWidth={1}
          borderBottomStyle="solid"
          borderColor="border.default"
          marginBottom="-0.5em"
        >
          Total users: {others.length + 1}
        </Box>
        <Box
          onPointerMove={(e) => {
            updateMyPresence({
              cursor: {
                x: e.clientX,
                y: e.clientY,
              },
              name,
              colors,
            });
          }}
          onPointerLeave={() => {
            updateMyPresence({ cursor: null });
          }}
          position="relative"
        >
          {others.map(({ connectionId, presence }) =>
            presence.cursor ? (
              <Cursor
                key={connectionId}
                x={presence.cursor.x}
                y={presence.cursor.y}
                name={presence.name}
                color={presence.colors}
              />
            ) : null
          )}
          <SyntaxHighlighter
            language={language}
            showLineNumbers={true}
            style={oneDark}
          >
            {content}
          </SyntaxHighlighter>
        </Box>
      </Box>
    </Box>
  );
}

export default function MultiplayerCursorBlock(props: FileBlockProps) {
  const { context, content, onRequestGitHubData } = props;
  const [username, setUsername] = useState("");

  const language = getLanguageFromFilename(context.path).toLowerCase();

  // Step 1 - Get a random color
  const color = randomColor();
  // Step 2 - Get 2 colors to use for gradient using previous as a "hue"
  const colors = randomColor({ hue: color, count: 2 });

  const getUser = async () => {
    const res = (await onRequestGitHubData(
      `/user`
    )) as Endpoints["GET /user"]["response"]["data"];

    setUsername(res.name || res.login);
  };

  useEffect(() => {
    // Get details about the current user (the one that's logged in and using this block)
    getUser();
  }, []);

  return (
    <RoomProvider
      id={`${context.repo}_${context.owner}_${context.sha}_${context.path}`}
      initialPresence={{
        cursor: null,
        name: username,
        colors,
      }}
    >
      <App
        content={content}
        name={username}
        colors={colors}
        hue={color}
        language={language}
      />
    </RoomProvider>
  );
}
