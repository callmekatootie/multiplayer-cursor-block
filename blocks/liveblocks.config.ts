import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: "pk_dev_rQGfdRz9vgB_h81RZmQeArFDBtImtfFkZlxkSYph2p0ezFyZ--YKOLmQcGJuRcuv"
});

type Presence = {
  cursor: { x: number; y: number } | null
};

export const {
  RoomProvider,
  useOthers,
  useUpdateMyPresence,
} = createRoomContext<Presence>(client);
