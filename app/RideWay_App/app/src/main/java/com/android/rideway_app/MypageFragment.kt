package com.android.rideway_app

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.android.rideway_app.Mypage.MypageActivity
import com.android.rideway_app.databinding.FragmentMypageBinding
import com.android.rideway_app.databinding.FragmentRunningBinding

class MypageFragment : Fragment() {
    lateinit var container : ViewGroup
    lateinit var binding: FragmentMypageBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        this.container = container!!
        binding = FragmentMypageBinding.inflate(layoutInflater)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.btnProfile.setOnClickListener {
            val intent = Intent(container.context, MypageActivity::class.java)
            startActivity(intent)
        }
    }
    companion object {

    }
}