import React from "react";
import { getComments } from "../../api/comment";
import { useQuery } from "react-query";
import { PacmanLoader } from "react-spinners";
import { Box, Grid } from "@chakra-ui/react";
import { Comment } from "./Comment";

export function CommentList({ productId, comments }) {
  const { data, isLoading } = useQuery("comments", () =>
    getComments(productId)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PacmanLoader color="#36d7b7" size={80} />
      </div>
    );
  }

  // console.log(comments);

  return (
    <Box display="flex" flexDirection="column">
      <Grid templateColumns="repeat(auto-fill, minmax(50%, 1fr))">
        {data.map((comment) =>
          comment.product === productId ? (
            <div style={{ margin: "15px" }}>
              <Comment key={comment._id} comment={comment} />
            </div>
          ) : null
        )}
      </Grid>
    </Box>
  );
}
