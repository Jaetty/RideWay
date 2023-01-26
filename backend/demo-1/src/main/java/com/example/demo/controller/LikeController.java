package com.example.demo.controller;

import com.example.demo.domain.Board;
import com.example.demo.domain.BoardGood;
import com.example.demo.domain.BoardGoodPK;
import com.example.demo.domain.Comment;
import com.example.demo.repository.BoardRepository;
import com.example.demo.repository.LikeRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping(value = "/like")
@CrossOrigin(
        // localhost:5500 과 127.0.0.1 구분
        origins = "http://localhost:8080", // allowCredentials = "true" 일 경우, origins="*" 는 X
        allowCredentials = "true",
        allowedHeaders = "*",
        methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT,RequestMethod.HEAD,RequestMethod.OPTIONS}
)
public class LikeController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    BoardRepository boardRepository;

    @Autowired
    LikeRepository likeRepository;

    // 좋아요
    @PostMapping("/")
    public ResponseEntity BoardLike(@RequestBody HashMap<String, Long> param) {
        try {
            Long boardId = param.get("board_id");
            Long userId = param.get("user_id");

            Board board = boardRepository.findByBoardId(boardId);
            BoardGood chk = likeRepository.findByBoardGoodPKBoardIdAndBoardGoodPKUserId(boardId, userId);

            BoardGoodPK BGPK = BoardGoodPK.builder()
                    .boardId(boardId)
                    .userId(userId)
                    .build();
            if (chk == null) {
                chk = BoardGood.builder()
                        .boardGoodPK(BGPK)
                        .selected(true)
                        .build();
                board.setLikeCount(board.getLikeCount()+1); // 좋아요 1 증가
            } else if (chk.isSelected()) {
                chk.setSelected(false);
                board.setLikeCount(board.getLikeCount()-1); // 좋아요 1 감소
            } else if (!chk.isSelected()){
                chk.setSelected(true);
                board.setLikeCount(board.getLikeCount()+1); // 좋아요 1 증가
            }
            likeRepository.save(chk);
            boardRepository.save(board);
            return new ResponseEntity(HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }

    }


}