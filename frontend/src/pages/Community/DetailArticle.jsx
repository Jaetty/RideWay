import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { LOAD_FREE_DETAIL_REQUEST } from '../../store/modules/communityModule';

const DetailArticle = () => {
  const dispatch = useDispatch();
  const {
    state: { boardId, boardCode },
  } = useLocation();
  useEffect(() => {
    dispatch({
      type: LOAD_FREE_DETAIL_REQUEST,
      data: { boardId, boardCode },
    });
  }, []);
  const detail = useSelector(state => state.community.freeDetail);
  console.log(detail);
  const detailTime = moment(detail.regTime).format('YYYY-MM-DD');
  return (
    <div>
      <h1>디테일</h1>
      {detail.title}
      {detail.userNickname}
      {detail.visited}
      {detail.likeCount}
      {detail.content}
      {detailTime}
    </div>
  );
};
export default DetailArticle;
