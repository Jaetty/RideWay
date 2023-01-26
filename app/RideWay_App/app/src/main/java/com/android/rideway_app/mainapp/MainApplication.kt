package com.android.rideway_app.mainapp

import android.app.Application

//전역 저장소
class MainApplication : Application() {
    companion object {
        lateinit var prefs: PreferenceUtil
    }

    override fun onCreate() {
        super.onCreate()
        prefs = PreferenceUtil(applicationContext)
    }
}