package com.android.rideway_app.community

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.android.rideway_app.R
import com.android.rideway_app.databinding.ActivityBoardDetailBinding

class BoardDetailActivity : AppCompatActivity() {

    private lateinit var binding : ActivityBoardDetailBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityBoardDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)
        binding.textView.text = intent.getStringExtra("boardNum")
    }

}


