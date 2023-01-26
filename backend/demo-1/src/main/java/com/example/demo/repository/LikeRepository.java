package com.example.demo.repository;

import com.example.demo.domain.BoardGood;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<BoardGood, Long> {

    BoardGood findByBoardGoodPKBoardIdAndBoardGoodPKUserId(Long boardId, Long userId);
}