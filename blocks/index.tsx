import { FileBlockProps } from "@githubnext/blocks";
import { Button, Box } from "@primer/react";
import {
  RoomProvider,
  useOthers,
  useUpdateMyPresence,
} from "./liveblocks.config";

function Cursor({ x, y }) {
  console.log('Rendered')
  return (
    <img
      style={{
        position: "absolute",
        transform: `translate(0px, 0px)`
      }}
      src="https://liveblocks.io/images/cursor.svg"
    />
  )
}

function App({ content }) {
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
        >
          Total users: {others.length + 1}
        </Box>
        <Box
          p={4}
          onPointerMove={(e) => {
            updateMyPresence({ cursor: { x: e.clientX, y: e.clientY } });
            console.log('On pointer move', e.clientX, e.clientY)
          }}
          onPointerLeave={() => {
            updateMyPresence({ cursor: null });
            console.log('on pointer leave');
          }}
          position="relative"
        >
          <pre className="mt-3 p-3">{content}</pre>
          {
            others.map(({ connectionId, presence, ...blah }) => {
              console.log(connectionId, presence, blah)
              return (
                <Cursor
                  key={connectionId}
                  // x={presence.cursor.x}
                  // y={presence.cursor.y}
                />
              )
              })
          }
        </Box>
      </Box>
    </Box>
  );
}

export default function MultiplayerCursorBlock(props: FileBlockProps) {
  const { context, content } = props;

  // return (
  //   <Box p={4}>
  //     <Box
  //       borderColor="border.default"
  //       borderWidth={1}
  //       borderStyle="solid"
  //       borderRadius={6}
  //       overflow="hidden"
  //     >
  //       <Box
  //         bg="canvas.subtle"
  //         p={3}
  //         borderBottomWidth={1}
  //         borderBottomStyle="solid"
  //         borderColor="border.default"
  //       >
  //         File: {context.path} {language}
  //       </Box>
  //       <Box p={4}>
  //         <p>Metadata example: this button has been clicked:</p>
  //         <Button
  //           onClick={() =>
  //             onUpdateMetadata({ number: (metadata.number || 0) + 1 })
  //           }
  //         >
  //           {metadata.number || 0} times
  //         </Button>
  //         <pre className="mt-3 p-3">{content}</pre>
  //       </Box>
  //     </Box>
  //   </Box>
  // );

  return (
    <RoomProvider id={`${context.repo}_${context.owner}_${context.sha}_${context.path}`} initialPresence={{ cursor: null }}>
      <App content={content}/>
    </RoomProvider>    
  );
}
