import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import FreeArticleListItem from '../../components/Community/FreeArticleListItem';
import { LOAD_FREE_BOARD_REQUEST } from '../../store/modules/communityModule';

const Free = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: LOAD_FREE_BOARD_REQUEST,
      data: {
        page: 0,
      },
    });
  }, []);

  const boards = useSelector(state => state.community.freeBoards);

  return (
    <div>
      <h1>자유게시판</h1>
      <hr />
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성일</th>
            <th>작성자</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {boards.map(board => (
            <FreeArticleListItem key={board.boardId} board={board} />
          ))}
        </tbody>
      </table>
      <Link to="/community/create">글쓰기</Link>
    </div>
  );
};
export default Free;
