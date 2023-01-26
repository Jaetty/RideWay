package com.android.rideway_app.retrofit.login

import com.android.rideway_app.retrofit.TestDataResponse
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface LoginService {
    //로그인
    @POST("/user/login")
    fun getLoginData(@Body loginData : LoginData) : Call<LoginDataResponse>

    @GET("/user/signup/id")
    fun getIdCheck(@Query("id") id : String) : Call<Boolean>

    @GET("/user/registerMail")
    fun getEmail(@Query("email") email : String) : Call<Boolean>

    @GET("/user/certMail")
    fun getCertCode(@Query("code") code : String) : Call<Boolean>

    @GET("/user/signup/nickname")
    fun getNickNameCode(@Query("nickname") code : String) : Call<Boolean>

    @POST("/user/findPassword")
    fun getNewPassword(@Body passSearchData : PassSearchData) : Call<PassSearchDataResponse>

    @POST("/user/findId")
    fun getId(@Body idSearchData : IdSearchData) : Call<IdSearchDataResponse>

    @POST("/user/signup")
    fun signupRequest(@Body signUpData: SignUpData) : Call<PassSearchDataResponse>

}