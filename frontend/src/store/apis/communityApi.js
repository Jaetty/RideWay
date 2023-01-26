/* eslint-disable */
import axios from 'axios';
import { BASE_URL, CONTEXT_URL } from '../../utils/urls';

// 자유게시판 전체 조회
export async function FreeBoardAPI({ page }) {
  const result = await axios.get(`${BASE_URL}board/100?page=${page}`);
  // console.log(result.data);
  return result.data.content;
}

export async function FreeDetailAPI({ boardId, boardCode }) {
  const result = await axios.get(
    `${BASE_URL}board/${boardCode}/?boardId=${boardId}`,
  );
  // console.log(result.data);
  return result.data;
}

export async function createBoardAPI({}) {}
