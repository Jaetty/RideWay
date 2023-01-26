package com.android.rideway_app.login

import android.app.Activity
import android.content.DialogInterface
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.core.content.ContextCompat
import androidx.core.widget.addTextChangedListener
import com.android.rideway_app.R
import com.android.rideway_app.databinding.ActivitySecondRegisterBinding
import com.android.rideway_app.retrofit.RetrofitClient
import com.android.rideway_app.retrofit.login.LoginService
import com.android.rideway_app.retrofit.login.PassSearchData
import com.android.rideway_app.retrofit.login.PassSearchDataResponse
import com.android.rideway_app.retrofit.login.SignUpData
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.*
import java.util.regex.Pattern

class SecondRegisterActivity : AppCompatActivity() {
    lateinit var binding: ActivitySecondRegisterBinding
    // 아래 변수들은 각각 이메일 유효성 및 인증 여부, 아이디 유효성 및 중복체크 여부, 비밀번호 유효성 및 중복 여부, 닉네임 중복여부를 확인함
    // 모두가 true일 경우에만 회원가입 요청을 보낸다.
    var idCheck = false
    var passCheck = false
    var nicknameCheck = false
    var weight : String = "60"
    var bikeWeight : String = "12"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySecondRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.toolbarTitle.text = "회원가입"

        binding.ivRegisterProfile.setOnClickListener {
            when {
                // 갤러리 접근 권한이 있는 경우
                ContextCompat.checkSelfPermission(
                    this,
                    android.Manifest.permission.READ_EXTERNAL_STORAGE
                ) == PackageManager.PERMISSION_GRANTED
                -> {
                    navigateGallery()
                }

                // 갤러리 접근 권한이 없는 경우 & 교육용 팝업을 보여줘야 하는 경우
                shouldShowRequestPermissionRationale(android.Manifest.permission.READ_EXTERNAL_STORAGE)
                -> {
                    showPermissionContextPopup()
                }

                // 권한 요청 하기(requestPermissions) -> 갤러리 접근(onRequestPermissionResult)
                else -> requestPermissions(
                    arrayOf(android.Manifest.permission.READ_EXTERNAL_STORAGE),
                    1000
                )
            }
        }

        // id 유효성 확인
        binding.etRegisterId.addTextChangedListener {
            idCheck = false
            binding.tvRegisterIdCheck.setTextColor(ContextCompat.getColor(applicationContext!!, R.color.littleRed))

            if(binding.etRegisterId.text.isEmpty()) {
                binding.tvRegisterIdCheck.text = ""
                binding.btnRegisterCheckId.isEnabled = false
            }
            else{
                if( !isIdCorrect(binding.etRegisterId.text.toString())){
                    binding.tvRegisterIdCheck.text = "아이디는 영문자 및 숫자로 5자 이상이어야 합니다."
                    binding.btnRegisterCheckId.isEnabled = false
                }
                else{
                    binding.tvRegisterIdCheck.text = "중복확인을 눌러주세요."
                    binding.btnRegisterCheckId.isEnabled = true
                }
            }
        }

        // 아이디 중복 확인
        binding.btnRegisterCheckId.setOnClickListener {
            idCheck(binding.etRegisterId.text.toString())
        }

        // 비밀번호 입력
        binding.etRegisterPass.addTextChangedListener {
            passCheck(binding.etRegisterPass.text.toString(), binding.etRegisterPassCheck.text.toString())
            if (isPassCorrect(binding.etRegisterPass.text.toString())){
                binding.tvRegisterPass.setTextColor(ContextCompat.getColor(applicationContext!!, R.color.blue))
                binding.tvRegisterPass.text = "사용 가능한 비밀번호입니다."
            }
            else{
                binding.tvRegisterPass.setTextColor(ContextCompat.getColor(applicationContext!!, R.color.littleRed))
                binding.tvRegisterPass.text = "영문, 숫자, 특수문자로 8-20자로 구성해주세요"

            }
        }

        // 비밀번호 확인
        binding.etRegisterPassCheck.addTextChangedListener {
            passCheck(binding.etRegisterPass.text.toString(), binding.etRegisterPassCheck.text.toString())
        }

        // 닉네임 확인
        binding.etRegisterNickName.addTextChangedListener {
            nicknameCheck = false
            binding.tvRegisterNickNameCheck.setTextColor(ContextCompat.getColor(applicationContext!!, R.color.littleRed))
            if(binding.etRegisterNickName.text.isEmpty()) binding.tvRegisterNickNameCheck.text = ""
            else nickNameCheck(binding.etRegisterNickName.text.toString())
        }

        binding.etRegisterWeight.addTextChangedListener {
            if(binding.etRegisterWeight.text.isEmpty()){
                weight = "65"
            }
        }

        binding.etRegisterBikeWeight.addTextChangedListener {
            if(binding.etRegisterBikeWeight.text.isEmpty()){
                bikeWeight = "12"
            }
        }

        binding.btnRegister.setOnClickListener {
           if(idCheck && passCheck && nicknameCheck){
               signUpRequest(binding.etRegisterId.text.toString(), binding.etRegisterPass.text.toString(), intent.getStringExtra("name")!!,
                   intent.getStringExtra("email")!!, binding.etRegisterNickName.text.toString(), "1", "no_image", "true",
                   intent.getStringExtra("si")!!, intent.getStringExtra("gun")!!, intent.getStringExtra("dong")!!,weight, bikeWeight,
                   intent.getStringExtra("birth")!!, intent.getStringExtra("gender")!!)
           }
        }

    }

    private fun passCheck(password1: String, password2: String){

        if(password2.isEmpty()) {
            binding.tvRegisterPassCheck.text = ""
            passCheck = false
            return
        }

        passCheck = password1 == password2

        if (passCheck){
            binding.tvRegisterPassCheck.setTextColor(ContextCompat.getColor(applicationContext!!, R.color.blue))
            binding.tvRegisterPassCheck.text = "비밀번호가 일치합니다."
        }
        else{
            binding.tvRegisterPassCheck.setTextColor(ContextCompat.getColor(applicationContext!!, R.color.littleRed))
            binding.tvRegisterPassCheck.text = "비밀번호가 일치하지 않습니다."
        }
    }

    // 비밀번호가 영어 숫자 특수문자 길이가 맞는지 확인하는 메소드
    private fun isPassCorrect(password: String): Boolean {
        val pwPattern = "^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!%*#?&.])[A-Za-z[0-9]$@$!%*#?&.]{8,20}$" // 영문, 숫자, 특수문자, 길이
        return Pattern.matches(pwPattern, password)
    }

    // 아이디가 영문 숫자로 5글자에서 20글자인지 확인하는 메소드
    private fun isIdCorrect(id: String): Boolean {
        val idPattern = "^(?=.*[a-z])[a-z[0-9]]{5,20}$" // 영문, 숫자 길이
        return Pattern.matches(idPattern, id)
    }

    // 아이디 중복검사를 수행하기 위해 백엔드에서 boolean값을 가져오는 메소드
    private fun idCheck(id : String){
        val retrofitAPI = RetrofitClient.getSimpleInstance().create(LoginService::class.java)

        retrofitAPI.getIdCheck(id).enqueue(object : Callback<Boolean> {
            override fun onResponse(call: Call<Boolean>, response: Response<Boolean>) {
                if(response.isSuccessful){
                    if(response.body() != null){
                        idCheckChange(response.body().toString().toBoolean()) // 만약 제대로 가져오면 수행되는 메소드
                    }
                    else{
                        Toast.makeText(this@SecondRegisterActivity,"결과는 받아왔지만 null값 가져옴", Toast.LENGTH_SHORT).show()
                    }
                }
                else{
                    Toast.makeText(this@SecondRegisterActivity,"결과 받아오기 실패", Toast.LENGTH_SHORT).show()
                }
            }
            override fun onFailure(call: Call<Boolean>, t: Throwable) {
                Toast.makeText(this@SecondRegisterActivity,"네트워크 접속 실패", Toast.LENGTH_SHORT).show()
            }
        })
    }

    // idcheck를 중복 여부에 맞는 값으로 변환해주는 메소드
    fun idCheckChange(check:Boolean){
        idCheck = !check

        if (!check){
            binding.tvRegisterIdCheck.text = "사용가능한 아이디 입니다."
            binding.tvRegisterIdCheck.setTextColor(ContextCompat.getColor(applicationContext!!, R.color.blue))
            binding.btnRegisterCheckId.isEnabled = true
        }
        else{
            binding.tvRegisterIdCheck.text = "이미 사용중인 아이디 입니다."
            binding.tvRegisterIdCheck.setTextColor(ContextCompat.getColor(applicationContext!!, R.color.littleRed))
            binding.btnRegisterCheckId.isEnabled = true
        }
    }

    private fun nickNameCheck(nickName : String){
        val retrofitAPI = RetrofitClient.getSimpleInstance().create(LoginService::class.java)

        retrofitAPI.getNickNameCode(nickName).enqueue(object : Callback<Boolean>{
            override fun onResponse(call: Call<Boolean>, response: Response<Boolean>) {
                if(response.isSuccessful){
                    if(response.body() != null){
                        if(!response.body()!!){
                            binding.tvRegisterNickNameCheck.text = "사용가능한 닉네임 입니다."
                            binding.tvRegisterNickNameCheck.setTextColor(ContextCompat.getColor(applicationContext!!, R.color.blue))
                            nicknameCheck = true
                        }
                        else binding.tvRegisterNickNameCheck.text = "이미 사용중인 닉네임입니다."
                    }
                    else{
                        Toast.makeText(this@SecondRegisterActivity,"네트워크 접속 오류 발생" ,Toast.LENGTH_SHORT).show()
                    }
                }
                else{
                    Toast.makeText(this@SecondRegisterActivity,"네트워크 접속 오류 발생",Toast.LENGTH_SHORT).show()
                }
            }
            override fun onFailure(call: Call<Boolean>, t: Throwable) {
                Toast.makeText(this@SecondRegisterActivity,"네트워크 접속 오류 발생",Toast.LENGTH_SHORT).show()
            }
        })
    }

    // 권한 요청 승인 이후 실행되는 함수
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        when (requestCode) {
            1000 -> {
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED)
                    navigateGallery()
                else
                    Toast.makeText(this, "권한을 거부하셨습니다.", Toast.LENGTH_SHORT).show()
            }
            else -> {
                //
            }
        }
    }

    private fun navigateGallery() {
        val intent = Intent(Intent.ACTION_PICK)
        // 가져올 컨텐츠들 중에서 Image 만을 가져온다.
        intent.type = "image/*"
        // 갤러리에서 이미지를 선택한 후, 프로필 이미지뷰를 수정하기 위해 갤러리에서 수행한 값을 받아오는 startActivityForeResult를 사용한다.
        startActivityForResult(intent, 2000)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        // 예외처리
        if (resultCode != Activity.RESULT_OK)
            return

        when (requestCode) {
            // 2000: 이미지 컨텐츠를 가져오는 액티비티를 수행한 후 실행되는 Activity 일 때만 수행하기 위해서
            2000 -> {
                val selectedImageUri: Uri? = data?.data
                if (selectedImageUri != null) {
                    binding.ivRegisterProfile.setImageURI(selectedImageUri)
                } else {
                    Toast.makeText(this, "사진을 가져오지 못했습니다.", Toast.LENGTH_SHORT).show()
                }
            }
            else -> {
                Toast.makeText(this, "사진을 가져오지 못했습니다.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun showPermissionContextPopup() {
        AlertDialog.Builder(this)
            .setTitle("권한이 필요합니다.")
            .setMessage("프로필 이미지를 바꾸기 위해서는 갤러리 접근 권한이 필요합니다.")
            .setPositiveButton("동의하기") { _, _ ->
                requestPermissions(arrayOf(android.Manifest.permission.READ_EXTERNAL_STORAGE), 1000)
            }
            .setNegativeButton("취소하기") { _, _ -> }
            .create()
            .show()
    }

    /*
    *
    * val id : String,
    val password : String,
    val name : String,
    val email : String,
    val nickname : String,
    val permission : String,
    val image_path : String,
    val open : Boolean,
    val si : String,
    val gun : String,
    val dong : String,
    val weight : String,
    val age : String,
    val gender : String,
    * */

    private fun signUpRequest(id:String, password: String, name:String, email:String, nickname:String,
                              permission : String, image_path : String, open : String, si : String,
                              gun : String, dong : String, weight : String, cycle_weight : String, age: String, gender:String
                              ){
        val retrofitAPI = RetrofitClient.getInstance().create(LoginService::class.java)

        retrofitAPI.signupRequest(SignUpData(id, password, name, email,nickname, "1", image_path, cycle_weight, "true", si, gun,dong, weight, age, gender)).enqueue(object :
            Callback<PassSearchDataResponse> {
            override fun onResponse(call: Call<PassSearchDataResponse>, response: Response<PassSearchDataResponse>) {
                if(response.isSuccessful){
                    println(response.body())
                    response.let{
                        //로그인 성공
                        if(it.code() == 200){
                            val intent = Intent(this@SecondRegisterActivity, LoginActivity::class.java)
                            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                            startActivity(intent)
                        }else{//정보가 틀릴 때
                            val dialog = AlertDialog.Builder(this@SecondRegisterActivity)
                            dialog.create()
                            dialog.setTitle("계정 오류")
                            dialog.setMessage("\n입력된 정보의 계정이 없습니다.")
                            dialog.setPositiveButton("확인", DialogInterface.OnClickListener { dialog, which -> })
                            dialog.show()
                        }
                    }
                }
                else{
                    val dialog = AlertDialog.Builder(this@SecondRegisterActivity)
                    dialog.create()
                    dialog.setTitle("계정 오류")
                    dialog.setMessage("\n입력된 정보의 계정이 없습니다.")
                    dialog.setPositiveButton("확인", DialogInterface.OnClickListener { dialog, which -> })
                    dialog.show()
                }
            }

            override fun onFailure(call: Call<PassSearchDataResponse>, t: Throwable) {
                Toast.makeText(this@SecondRegisterActivity, "네트워크 접속 오류가 발생하였습니다.\n잠시후 다시 시도해주세요", Toast.LENGTH_LONG).show()
            }
        })
    }
}