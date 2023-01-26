package com.android.rideway_app.Mypage

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.android.rideway_app.databinding.ActivityMypageBinding

class MypageActivity : AppCompatActivity() {
    lateinit var binding: ActivityMypageBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMypageBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }
}