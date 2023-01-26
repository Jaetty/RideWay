package com.android.rideway_app

import android.content.Context
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.android.rideway_app.community.BoardFragment
import com.android.rideway_app.databinding.ActivityMainBinding
import com.google.android.material.bottomnavigation.BottomNavigationView

class MainActivity : AppCompatActivity() {

    lateinit var binding : ActivityMainBinding
    lateinit var response : String

    init{
        instance = this
    }
    companion object{
        private lateinit var instance : MainActivity
        fun getInstance() :MainActivity{
            return instance!!
        }
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        var bottomNav = binding.bottomNav as BottomNavigationView

        val toolbar = binding.tbMainToolBar

        response = intent.getStringExtra("response").toString()

        // OnNavigationItemSelectedListener를 통해 탭 아이템 선택 시 이벤트를 처리
        // navi_menu.xml 에서 설정했던 각 아이템들의 id를 통해 알맞은 프래그먼트로 변경하게 한다.
        bottomNav.run { setOnNavigationItemSelectedListener {
            when(it.itemId) {
                R.id.if_community -> {
                    // 다른 프래그먼트 화면으로 이동하는 기능
                    toolbar.visibility = View.VISIBLE
                    binding.toolbarTitle.text = "커뮤니티"
                    val communityFragment = CommunityFragment()
                    supportFragmentManager.beginTransaction().replace(R.id.fl_container, communityFragment).
                    addToBackStack(null).commit()
                }
                R.id.if_running -> {
                    toolbar.visibility = View.INVISIBLE
                    val runningFragment = RunningFragment()
                    supportFragmentManager.beginTransaction().replace(R.id.fl_container, runningFragment).
                    addToBackStack(null).commit()
                }
                R.id.if_profile -> {
                    toolbar.visibility = View.VISIBLE
                    binding.toolbarTitle.text = "마이페이지"
                    val mypageFragment = MypageFragment()
                    supportFragmentManager.beginTransaction().replace(R.id.fl_container, mypageFragment).
                    addToBackStack(null).commit()
                }
            }
            true
        }
            selectedItemId = R.id.if_community
        }
    }

    //하위 프래그먼트에서 프래그먼트를 교체시킬 수 있도록 상위 액티비티에서 교체가능한 함수를 제공함
    fun changeBoardFragment(index: Int){
        when(index){
            1 -> {
                supportFragmentManager
                    .beginTransaction()
                    .replace(R.id.fl_container, BoardFragment())
                    .addToBackStack(null)
                    .commit()
            }
        }
    }
}