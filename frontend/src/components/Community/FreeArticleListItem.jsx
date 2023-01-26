import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

const FreeArticleListItem = ({ board }) => {
  const articleTime = moment(board.regTime).format('YYYY-MM-DD');
  // const { boardId } = board.boardId;
  // console.log(board);
  return (
    <tr>
      <td>{board.boardId}</td>
      <td>
        <Link
          to="/community/free/detail"
          state={{ boardId: board.boardId, boardCode: 100 }}
        >
          {board.title}
        </Link>
      </td>
      <td>{articleTime}</td>
      <td>{board.userNickName}</td>
      <td>{board.visited}</td>
    </tr>
  );
};
export default FreeArticleListItem;
