package com.android.rideway_app.map

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.android.rideway_app.databinding.ActivityMapBinding
import com.naver.maps.map.NaverMapSdk


class MapActivity : AppCompatActivity() {
    lateinit var binding : ActivityMapBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMapBinding.inflate(layoutInflater)
        setContentView(binding.root)

        NaverMapSdk.getInstance(this@MapActivity).client = NaverMapSdk.NaverCloudPlatformClient("is58t3w4qp")

    }
}