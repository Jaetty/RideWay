package com.android.rideway_app.retrofit

import okhttp3.Interceptor
import okhttp3.Response
import java.io.IOException

//헤더에 jwp 토큰 자동으로 추가
class AppInterceptor : Interceptor {
    @Throws(IOException::class)
    override fun intercept(chain: Interceptor.Chain) : Response = with(chain) {
        val newRequest = request().newBuilder()
            .addHeader("token", "test")
            .build()
        proceed(newRequest)
    }
}