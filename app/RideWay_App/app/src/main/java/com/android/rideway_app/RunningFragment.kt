package com.android.rideway_app

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.android.rideway_app.databinding.FragmentRunningBinding
import com.android.rideway_app.map.MapActivity


class RunningFragment : Fragment() {
    // TODO: Rename and change types of parameters
    lateinit var container : ViewGroup
    lateinit var binding: FragmentRunningBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        this.container = container!!
        binding = FragmentRunningBinding.inflate(layoutInflater)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.btnRunning.setOnClickListener {
            val intent = Intent(container.context, MapActivity::class.java)
            startActivity(intent)
        }
    }

    companion object {

    }
}