package com.android.rideway_app.retrofit.community

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface BoardService {

    @GET("/board/code")
    fun getBoardCode() : Call<List<BoardKind>>

    @GET("/board/{board_code}")
    fun getBoardList(@Path("board_code") board_code : Int) : Call<BoardDataResponse>

    @GET("/board/detail")
    fun getBoardDetail(@Query("board_id") board_id : Int) : Call<List<String>>

    @POST("/board/insert")
    fun insertBoard(@Body dd : String) : Call<Boolean>

    @PUT("/board/update/{id}")
    fun updateBoard(@Path("id") board_id : Int) : Call<Boolean>

    @DELETE("/board/delete/{id}")
    fun deleteBoard(@Path("id") board_id : Int) : Call<Boolean>
}