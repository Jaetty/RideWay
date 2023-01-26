/* eslint-disable */
import axios from 'axios';
import { BASE_URL, CONTEXT_URL } from '../../utils/urls';

// 로그인 상태 확인
export async function myPageAPI(token) {
    const result = await axios.post(`${BASE_URL}user/getUserInfo`, token);
    return result;
  }
  