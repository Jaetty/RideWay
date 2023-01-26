package com.android.rideway_app

import android.app.Application
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.core.os.bundleOf
import androidx.fragment.app.setFragmentResult
import androidx.fragment.app.setFragmentResultListener
import androidx.recyclerview.widget.LinearLayoutManager
import com.android.rideway_app.community.CommunityListAdapter
import com.android.rideway_app.databinding.FragmentCommunityBinding
import com.android.rideway_app.retrofit.RetrofitClient
import com.android.rideway_app.retrofit.community.BoardKind
import com.android.rideway_app.retrofit.community.BoardService
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class CommunityFragment : Fragment() {

    private lateinit var container : ViewGroup
//    private lateinit var community_list : List<String>
    private lateinit var binding : FragmentCommunityBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    //이 때 커뮤니티 목록을 가져옴
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        this.container = container!!
        binding = FragmentCommunityBinding.inflate(inflater,container,false)
        getCommunityList()

        // Inflate the layout for this fragment
        return binding.root
    }

    //게시판 종류
    private fun getCommunityList(){

        var retrofitAPI = RetrofitClient.getInstance().create(BoardService::class.java)

        retrofitAPI.getBoardCode().enqueue(object : Callback<List<BoardKind>>{
            override fun onResponse(
                call: Call<List<BoardKind>>,
                response: Response<List<BoardKind>>
            ) {
                if(response.isSuccessful){
                    var board_kind_list : List<BoardKind> = response.body()!!
                    println(board_kind_list)
                    setRecyclerView(board_kind_list)
                }else{
                    println(response)
                    Toast.makeText(container.context,"커뮤니티 목록을 불러올 수 없습니다.",Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<BoardKind>>, t: Throwable) {
                t.printStackTrace()
                Toast.makeText(container.context,"커뮤니티 목록을 불러올 수 없습니다.",Toast.LENGTH_SHORT).show()
            }

        })

    }

    //리스트를 토대로 리사이클러 뷰를 채운다.
    private fun setRecyclerView(board_kind_list : List<BoardKind>){
        val adapter : CommunityListAdapter = CommunityListAdapter(this, board_kind_list)
        binding.recyclerView.adapter = adapter
        binding.recyclerView.layoutManager = LinearLayoutManager(context)
    }

    fun setBoardInformation(code : Int , name : String){
        println("set Board Information")
        setFragmentResult("Board" , bundleOf(
            "name" to name,
            "code" to code
        ))
    }
}