package com.example.demo.controller;

import com.example.demo.domain.Board;
import com.example.demo.domain.BoardCode;
import com.example.demo.domain.Comment;
import com.example.demo.domain.User;
import com.example.demo.mapping.BoardListMapping;
import com.example.demo.mapping.CommentMapping;
import com.example.demo.repository.BoardCodeRepository;
import com.example.demo.repository.BoardRepository;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/board")
@CrossOrigin(
        // localhost:5500 과 127.0.0.1 구분
        origins = "http://localhost:3000", // allowCredentials = "true" 일 경우, origins="*" 는 X
        allowCredentials = "true",
        allowedHeaders = "*",
        methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT,RequestMethod.HEAD,RequestMethod.OPTIONS}
)
public class BoardController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    BoardRepository boardRepository;

    @Autowired
    BoardCodeRepository boardCodeRepository;

    @Autowired
    CommentRepository commentRepository;

    // {userId} 유저가 작성한 모든 글
    @GetMapping("/test")
    public List<Board> findUserInfo(Long userId){
        User user = userRepository.findByUserId(userId);
        return boardRepository.findByUserId(user);
    }

    // 게시판 코드
    @GetMapping("/code")
    public ResponseEntity codeList() {
        try {
            return new ResponseEntity<>(boardCodeRepository.findAll(), HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }

    // 게시판 검색
    @GetMapping("/search") 
    public ResponseEntity findBoardSearch(
//            @PathVariable("boardCode") int boardCode,
                                          @PageableDefault(size=10) Pageable pageable, String keyword) {
//        System.out.println("boardCode : " + boardCode);
        System.out.println("page : " + pageable);
        System.out.println("word : " + keyword);
        try {
            Page<BoardListMapping> result = boardRepository.findByTitleContaining(keyword, pageable);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }

    // {boardId} 게시판 글 상세 내용 보기
    @GetMapping("/{boardCode}/")
    public ResponseEntity findBoardInfo(@PathVariable("boardCode") int boardCode, Long boardId) {
        try {
            Board result = boardRepository.findByBoardId(boardId);
            System.out.println(result);
            List<CommentMapping> comment = commentRepository.findByBoardId(result);
            System.out.println(comment);

            Map<String, Object> map = new HashMap<>();
            map.put("boardId", result.getBoardId());
            map.put("userNickname", result.getUserId().getNickname());
            map.put("boardCode", result.getBoardCode());
            map.put("count", result.getCount());
            map.put("title", result.getTitle());
            map.put("content", result.getContent());
            map.put("visited", result.getVisited());
            map.put("likeCount", result.getLikeCount());
            map.put("hateCount", result.getHateCount());
            map.put("regTime", result.getRegTime());

            map.put("comment", comment);

            return new ResponseEntity<>(map, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }

    // 게시판 리스트 - pagination
    @GetMapping("/{boardCode}")
    public ResponseEntity BoardList(@PathVariable("boardCode") int boardCode,
                                    @PageableDefault(size=10) Pageable pageable) {
        try {
            Page<BoardListMapping> result = boardRepository.findAllByBoardCode(pageable, boardCode);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }


    // 게시판 글작성
    @PostMapping("/")
    public ResponseEntity InsertBoard(@RequestBody HashMap<String, Object> param) {

        System.out.println(param);
        Long userId = Long.valueOf(String.valueOf(param.get("user_id")));
        String title = (String) param.get("title");
        String content = (String) param.get("content");
        int bc = Integer.parseInt(String.valueOf(param.get("board_code")));

        User user = userRepository.findByUserId(userId);

        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String nowDateTime = now.format(dateTimeFormatter);
        LocalDateTime nowTime = LocalDateTime.parse(nowDateTime, dateTimeFormatter);
        System.out.println(nowTime);

        // BoardCode의 count 읽어와서 +1
        BoardCode boardCode = boardCodeRepository.findByCode(bc);
        Long cnt = boardCode.getCount() + 1;
        boardCode.setCount(cnt);
        boardCodeRepository.save(boardCode);

        Board board = Board.builder()
                .userId(user)
                .boardCode(bc)
                .count(cnt)
                .title(title)
                .content(content)
                .visited(Long.parseLong("0"))
                .likeCount(Long.parseLong("0"))
                .hateCount(Long.parseLong("0"))
                .regTime(nowTime)
                .build();
        try {
            boardRepository.save(board);
            return new ResponseEntity(HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }



    // 게시판 글수정
    @PutMapping("/")
    public ResponseEntity UpdateBoard(@RequestBody HashMap<String, Object> param) {
        // 기존의 데이터 불러오기

        Long boardId = Long.valueOf(String.valueOf(param.get("board_id")));
        Long userId = Long.valueOf(String.valueOf(param.get("user_id")));
        int boardCode = Integer.parseInt(String.valueOf(param.get("board_code")));
        String title = (String) param.get("title");
        String content = (String) param.get("content");


        Board originalBoard = boardRepository.findByBoardId(boardId);
        originalBoard.setTitle(title);
        originalBoard.setContent(content);
        originalBoard.setBoardCode(boardCode);
//        originalBoard.setTime(board.getTime());
//        originalBoard.setLike(board.getLike());
//        originalBoard.setHate(board.getHate());

        // 수정한 데이터 업데이트
        try {

            boardRepository.save(originalBoard);
            return new ResponseEntity(HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }

    }

    // 게시판 글삭제
    @DeleteMapping("/")
    public ResponseEntity DeleteBoard(Long boardId) {
        Board board = boardRepository.findById(boardId).orElseThrow(IllegalArgumentException::new);


        try {
            boardRepository.delete(board);
            commentRepository.deleteByBoardId(board);
            return new ResponseEntity(HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }







}