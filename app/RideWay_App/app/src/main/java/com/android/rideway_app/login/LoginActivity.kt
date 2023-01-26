package com.android.rideway_app.login

import android.app.Activity
import android.content.Intent
import android.content.SharedPreferences
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import com.android.rideway_app.MainActivity
import com.android.rideway_app.databinding.ActivityLoginBinding
import com.android.rideway_app.retrofit.RetrofitClient
import com.android.rideway_app.retrofit.login.LoginData
import com.android.rideway_app.retrofit.login.LoginDataResponse
import com.android.rideway_app.retrofit.login.LoginService
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginActivity : AppCompatActivity() {
    private lateinit var binding : ActivityLoginBinding
    private lateinit var autoLogin: SharedPreferences
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        println("START!!")
        autoLogin = getSharedPreferences("autoLogin", Activity.MODE_PRIVATE)
        setContentView(binding.root)

        //현재 로그인 번호가 남아있는지 확인한다.
        loginCheck()
        binding.btnLogin.setOnClickListener {
            val id = binding.etId.text.toString()
            val password = binding.etPassword.text.toString()
            println("Click!!")
            login(id,password)
        }

    }

    private fun loginCheck(){
        println("로그인 정보 확인!!")
        val id = autoLogin.getString("id",null)
        val password = autoLogin.getString("password",null)
        //로그인 정보가 있을경우 즉시 로그인
        if(id != null && password != null){

           login(id,password)
        }
        println("로그인 정보 없음!!")
    }
//    private fun login(response: Response<LoginDataResponse>){
//
//
//        val intent : Intent = Intent(this@LoginActivity, MainActivity::class.java)
//        intent.putExtra("response", response.body()!![0].title.toString())
//     //아래 코드는 새로 여는 intent 외의 모든 쌓여있는 activity stack을 다 비워주는 코드
//        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
//        startActivity(intent)
//        finish()
//    }

    fun login(id : String , password : String){
        val retrofitAPI = RetrofitClient.getInstance().create(LoginService::class.java)

        retrofitAPI.getLoginData(LoginData(id,password)).enqueue(object : Callback<LoginDataResponse>{
            override fun onResponse(call: Call<LoginDataResponse>, response: Response<LoginDataResponse>) {
                if(response.isSuccessful){
                    println(response.body())
                    response.let{
                        //로그인 성공
                        if(it.code() == 200){
                            //로그인 정보 저장
                            val autoLoginEdit = autoLogin.edit()
                            autoLoginEdit.putString("id",id)
                            autoLoginEdit.putString("password",password)
                            autoLoginEdit.putInt("permission",it.body()!!.permission)
                            autoLoginEdit.putString("token",it.body()!!.token)
                            autoLoginEdit.apply()

                            //로그인 완료 후 메인페이지 이동
                            val intent = Intent(this@LoginActivity, MainActivity::class.java)
                            startActivity(intent)
                            finish()
                        }else if(response.code() == 404){//회원정보 없음
                            Toast.makeText(this@LoginActivity, "가입되지 않은 사용자입니다.", Toast.LENGTH_SHORT).show()
                        }else{//정보가 틀릴 때
                            Toast.makeText(this@LoginActivity, "아이디 혹은 비밀번호가 틀렸습니다.", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
                else{
                    Toast.makeText(this@LoginActivity, "아니 왜 안돼 ㅡㅡ", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<LoginDataResponse>, t: Throwable) {
                Toast.makeText(this@LoginActivity, "애초에 안돼 ㅡㅡ", Toast.LENGTH_SHORT).show()
            }
        })
    }
}