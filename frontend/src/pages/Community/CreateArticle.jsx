/* eslint-disable */
import React, { useRef, useState } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';
import { useDispatch } from 'react-redux';
import { CREATE_BOARD_REQUEST } from '../../store/modules/communityModule';
// import axios from 'axios';

const createArticle = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [boardCode, setBoardCode] = useState(100);
  const editorRef = useRef();
  const dispatch = useDispatch();
  const contentChange = () => {
    const data = editorRef.current.getInstance().getHTML();
    console.log(data);
    setContent(data);
  };

  const titleChange = e => {
    setTitle(e.target.value);
  };

  const BoardCodeChange = e => {
    const code = parseInt(e.target.value);
    setBoardCode(code);
    console.log(code);
  };

  const onSubmit = e => {
    e.preventDefault();
    console.log(title, content, boardCode);
    dispatch({
      type: CREATE_BOARD_REQUEST,
      data: {},
    });
  };

  return (
    <div>
      <h1>게시글 생성</h1>
      <hr />
      <select onChange={BoardCodeChange} name="pets" id="pet-select">
        <option value="100">자유게시판</option>
        <option value="200">질문게시판</option>
        <option value="300">인증게시판</option>
        <option value="400">정보게시판</option>
      </select>
      <form onSubmit={onSubmit}>
        <div>
          <input value={title} onChange={titleChange} id="title" type="text" />
        </div>
        <hr />
        <Editor
          // initialValue="hello react editor world!"
          placeholder="내용을 입력해주세요."
          previewStyle="vertical"
          height="600px"
          initialEditType="wysiwyg"
          useCommandShortcut={true}
          plugins={[colorSyntax]}
          language="ko-KR"
          ref={editorRef}
          onChange={contentChange}
          // hooks={{
          //   addImageBlobHook: async (blob, callback) => {
          //     console.log(blob);
          //     const formData = new FormData();
          //     formData.append('file', blob);
          //     const response = await axios.post('/api/upload', formData);
          //     console.log(response);
          //   },
          // }}
        />
        {/* <Viewer initialValue={content} /> */}
        <hr />
        <div>
          <input type="file" name="image" />
        </div>
        <input type="submit" value="작성 완료" />
        <button>취소</button>
      </form>
    </div>
  );
};

export default createArticle;
